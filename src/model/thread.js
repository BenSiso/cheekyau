/* eslint-disable no-console */
import { col, convertTimeOf, toList } from '../services/db';
import { startTimer } from '../utilities/dev';
import Category from './category';

export default class Thread {
  static fill = async (threadData) => {
    const thread = typeof threadData.data === 'function' ? threadData.data() : threadData;
    const end = startTimer(`fill - c:${thread.cid || 'X'} - t:${thread.tid || 'X'}`);
    if (!thread.category && thread.cid) {
      thread.category = await Category.getById(thread.cid);
    }
    end();
    return thread;
  };

  static getAll = async () => {
    console.time('getAll - doc🧐');
    const docRef = await col('thread').orderBy('tid', 'desc').limit(25).get();
    console.timeEnd('getAll - doc🧐');

    console.time('getAll - fill🧐');
    const threads = await Promise.all(toList(docRef).map((d) => this.fill(d)));
    console.timeEnd('getAll - fill🧐');

    return threads;
  };

  static getAllForSearch = async () => {
    const docRef = await col('thread').orderBy('tid', 'desc').get();
    const threads = await Promise.all(toList(docRef).map((d) => this.fill(d)));
    return threads;
  };

  static getNextThreads = async (lastTid) => {
    const docRef = await col('thread').orderBy('tid', 'desc').startAfter(lastTid).limit(25).get();
    const threads = await Promise.all(toList(docRef).map((d) => this.fill(d)));
    return threads;
  };

  static getPopular = async () => {
    const end1 = startTimer('getPop - doc');
    const docRef = await col('thread').orderBy('likeCount', 'desc').limit(25).get();
    end1();
    const end2 = startTimer('getPop - fill');
    const threads = await Promise.all(toList(docRef).map((t) => this.fill(t)));
    end2();
    return threads;
  };

  static getNextPopular = async (lastLikeCount) => {
    const docRef = await col('thread')
      .orderBy('likeCount', 'desc')
      .startAfter(lastLikeCount)
      .limit(25)
      .get();
    const threads = await Promise.all(toList(docRef).map((t) => this.fill(t)));
    return threads;
  };

  static getById = async (id) => {
    const end1 = startTimer('getById - doc');
    const docRef = await col('thread').doc(id).get();
    end1();
    const end2 = startTimer('getById - fill');
    const thread = await this.fill(docRef);
    end2();
    return convertTimeOf({
      id: docRef.id,
      ...thread,
    });
  };

  static getComments = async (id) => {
    const end = startTimer('getComm');
    const snapshot = await col('thread')
      .doc(`${id}`)
      .collection('comment')
      .orderBy('createdAt')
      .limit(25)
      .get();
    end();
    const comments = snapshot.docs.map((d) => convertTimeOf({ id: d.id, ...d.data() }));
    return comments;
  };

  static getNextComments = async (id, lastCreatedAt) => {
    const snapshot = await col('thread')
      .doc(id)
      .collection('comment')
      .orderBy('createdAt')
      .startAfter(lastCreatedAt)
      .limit(25)
      .get();

    const comments = snapshot.docs.map((d) => convertTimeOf({ id: d.id, ...d.data() }));
    return comments;
  };

  static getByCategory = async (cid) => {
    const docRef = await col('thread')
      .orderBy('tid', 'desc')
      .where('cid', '==', cid)
      .limit(25)
      .get();
    const threads = await Promise.all(toList(docRef).map((d) => this.fill(d)));
    return threads;
  };
  // Getting the next batch threads *** Implement for infinite scroll ***

  static getByCategoryNext = async (cid, lastTid) => {
    const docRef = await col('thread')
      .orderBy('tid', 'desc')
      .where('cid', '==', cid)
      .startAfter(lastTid)
      .limit(25)
      .get();
    const threadsNextBatch = await Promise.all(toList(docRef).map((d) => this.fill(d)));
    return threadsNextBatch;
  };

  static getComment = async (id, commentId) => {
    const docRef = await col('thread').doc(`${id}`).collection('comment').doc(`${commentId}`).get();
    const comment = docRef.data();
    return convertTimeOf({ id: docRef.id, ...comment });
  };

  static getThread = async (id) => {
    const docRef = await col('thread').doc(`${id}`).get();
    const thread = docRef.data();
    return convertTimeOf({ id: docRef.id, ...thread });
  };

  static onReplyCount = async (id, commentId) => {
    const comment = await this.getComment(id, commentId);

    // This is for update the old comment that not added replyCount
    let replyCount;
    if (comment.replyCount === undefined) {
      await this.updateOldCommentReplyCount(id, commentId);
    } else {
      // Update new comment ReplyCount
      replyCount = comment?.replyCount * 1 + 1;
      await this.updateCommentReplyCount(id, commentId, replyCount);
    }

    return { replyCount };
  };

  static updateOldCommentReplyCount = async (id, commentId) => {
    await col('thread')
      .doc(`${id}`)
      .collection('comment')
      .doc(commentId)
      .update({ replyCount: 1, updatedAt: new Date() });
  };

  static updateCommentReplyCount = async (id, commentId, replyCount) => {
    await col('thread')
      .doc(`${id}`)
      .collection('comment')
      .doc(commentId)
      .update({ replyCount, updatedAt: new Date() });
  };

  static updateCommentCount = async (id, commentCount) => {
    return col('thread').doc(`${id}`).update({ commentCount, updatedAt: new Date() });
  };

  static replyComment = async (tid, comment, commentCount) => {
    await Promise.all([
      await col('thread')
        .doc(`${tid}`)
        .collection('comment')
        .add({
          ...comment,
          createdAt: new Date(),
        }),
      await col('thread')
        .doc(`${tid}`)
        .update({ commentCount: commentCount * 1 + 1 }),
    ]);
  };

  static add = async (tid, thread) => {
    await col('thread')
      .doc(`${tid}`)
      .set({
        ...thread,
        createdAt: new Date(),
      });
  };

  static getLastTid = async () => {
    const docRef = await col('thread').orderBy('tid', 'desc').limit(1).get();
    const lastTid = docRef.docs[0].data().tid;
    return lastTid;
  };

  static onSeedCommentCountFieldAllThread = async () => {
    const docRef = await col('thread').get();

    const threads = await Promise.all(toList(docRef).map((d) => this.fill(d)));
    threads.map(async (t) => {
      const updateField = {
        commentCount: t.commentCount,
      };
      await this.onSeedField(t.id, updateField);
      console.log('🌱 Seed Comment Count Updated 🌱 >>> ', t.id, updateField);

      return { ...t, ...updateField };
    });
    return threads.length;
  };

  static onSeedField = async (id, updateField) => {
    await col('thread').doc(`${id}`).update(updateField);
  };

  static seedTimeConvertAllThread = async () => {
    const docRef = await col('thread').get();

    const threads = await Promise.all(docRef.docs.map((d) => this.fill(d)));
    threads.map(async (t) => {
      const updateField = {
        createdAt: t.createdAt,
        updatedAt: new Date(),
        updatedBy: 'Admin',
      };
      if (typeof t.createdAt === 'string') {
        updateField.createdAt = new Date(t.createdAt);
        console.log('💣💣💣🌱 Seed Time Convert String 🌱 >>> ', t.tid, updateField);
      }

      if (typeof t.createdAt === 'number') {
        updateField.createdAt = new Date(t.createdAt * 1000);
        console.log('💣💣💣🌱 Seed Time Convert Second 🌱 >>> ', t.tid, updateField);
      }
      if (typeof t.createdAt === 'undefined') {
        updateField.createdAt = new Date();

        console.log('💣💣💣🌱 Seed Time Convert Undefined 🌱 >>> ', t.tid, updateField);
      }
      await this.onSeedField(t.tid, updateField);
      // console.log('🌱 Seed Time Updated 🌱 >>> ', t.tid, updateField);

      return { ...t, ...updateField };
    });
    return threads.length;
  };

  static seedTimeConvertComments = async () => {
    const docRef = await col('thread').get();
    const threads = await Promise.all(docRef.docs.map((d) => this.fill(d)));

    const resD = await threads.map(async (t) => {
      if (t.commentCount > 0) {
        const comments = await this.getComments(t.tid);
        comments.map(async (c) => {
          const updateField = {
            createdAt: c.createdAt,
            updatedAt: new Date(),
            updatedBy: 'Admin',
          };
          if (typeof c.createdAt === 'string') {
            updateField.createdAt = new Date(c.createdAt);
            console.log('💣💣💣🌱 Seed Time Convert String 🌱 >>> ', c.id, updateField);
          }

          if (typeof c.createdAt === 'number') {
            updateField.createdAt = new Date(c.createdAt * 1000);
            console.log('💣💣💣🌱 Seed Time Convert Second 🌱 >>> ', c.id, updateField);
          }
          if (typeof c.createdAt === 'undefined') {
            updateField.createdAt = new Date();

            console.log('💣💣💣🌱 Seed Time Convert Undefined 🌱 >>> ', c.id, updateField);
          }
          await this.updateCommentField(t.tid, c.id, updateField);
          return { ...t, ...updateField };
        });
        console.log('🌱 Seed Time Convert Total Comments 🌱 >>> ', t.commentCount);

        return { tid: t.tid, totalCmt: comments.length };
      }
      return { totalCmt: 0, tid: t.tid, totalThread: threads.length };
    });
    return { threadList: resD, totalThread: threads.length };
  };

  static updateCommentField = async (id, commentId, updateField) => {
    await col('thread').doc(`${id}`).collection('comment').doc(`${commentId}`).update(updateField);
  };
}
