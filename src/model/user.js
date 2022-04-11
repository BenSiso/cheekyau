/* eslint-disable no-console */
import { col, convertTimeOf } from '../services/db';

export default class User {
  static getById = async (id) => {
    const doc = await col('user').doc(id).get();
    return {
      id: doc.id,
      ...doc.data(),
    };
  };

  static getByUid = async (uid) => {
    const doc = await col('user').where('uid', '==', uid).limit(1).get();
    const [userData] = doc.docs.map((u) => ({ id: u.id, ...u.data() }));
    return {
      ...userData,
    };
  };

  static getByEmail = async (email) => {
    const doc = await col('user').where('email', '==', email).limit(1).get();
    const [userData] = doc.docs.map((u) => ({ uid: u.id, ...u.data() }));

    // console.log(userData);
    return {
      ...userData,
    };
  };

  /*
                ===================================
                             User Activity
                ===================================
 */

  /*
                ____________________________________
               |           Like Activity            |
               |____________________________________|
 */
  static getCommentIdsLikedActivity = async (uid) => {
    const { id } = await this.getByUid(uid);
    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('likes')
      .collection('comments')
      .get();

    return doc.docs.map((d) => d.data().commentId);
  };

  static getLikedActivity = async (commentId, uid) => {
    const { id } = await this.getByUid(uid);
    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('likes')
      .collection('comments')
      .where('commentId', '==', commentId)
      .limit(1)
      .get();
    const likeActivity = await doc.docs.map((l) => l.data());
    const [lid] = await doc.docs.map((l) => l.id);
    const isExisted = likeActivity.length > 0;
    // console.log('my activity', lid, likeActivity[0]?.isLiked);
    return { isLiked: likeActivity[0]?.isLiked, lid, isExisted };
  };

  static updateLikeActivity = async (uid, tid, commentId, lid, isLiked, likeCount) => {
    const { id } = await this.getByUid(uid);
    if (isLiked) {
      await col('user')
        .doc(`${id}`)
        .collection('activity')
        .doc('likes')
        .collection('comments')
        .doc(`${lid}`)
        .update({
          isLiked: false,
          createdAt: new Date(),
        });
      if (likeCount > 0) {
        await col('thread')
          .doc(`${tid}`)
          .collection('comment')
          .doc(`${commentId}`)
          .update({ likeCount: likeCount * 1 - 1 });
        console.log('Activity Existed and liked now  unlike and total like decrease 1');
      } else {
        console.log(
          'Activity Existed and liked still the same bcuz current like is 0 this is to handle conflict'
        );
      }
    } else {
      await col('user')
        .doc(`${id}`)
        .collection('activity')
        .doc('likes')
        .collection('comments') // like on comment then will store in comment of like activity
        .doc(`${lid}`)
        .update({
          isLiked: true,
          createdAt: new Date(),
        });
      await col('thread')
        .doc(`${tid}`)
        .collection('comment')
        .doc(`${commentId}`)
        .update({ likeCount: likeCount * 1 + 1 });
      console.log('Activity Existed and not yet liked now added like');
    }
  };

  static addLikeActivity = async (uid, tid, commentId, likeActivity, likeCount) => {
    const { id } = await this.getByUid(uid);

    await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('likes')
      .collection('comments') // like on comment then will store in comment of like activity
      .add({
        ...likeActivity,
        isLiked: true,
      });
    await col('thread')
      .doc(`${tid}`)
      .collection('comment')
      .doc(`${commentId}`)
      .update({ likeCount: likeCount * 1 + 1 });
    console.log('Add Like Activity (new) Success');
  };

  /*
                ____________________________________
               |          Dislike Activity          |
               |____________________________________|
 */
  static getCommentIdsDislikedActivity = async (uid) => {
    const { id } = await this.getByUid(uid);
    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('dislikes')
      .collection('comments')
      .get();
    return doc.docs.map((d) => d.data().commentId);
  };

  static getDislikedActivity = async (commentId, uid) => {
    const { id } = await this.getByUid(uid);

    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('dislikes')
      .collection('comments')
      .where('commentId', '==', commentId)
      .limit(1)
      .get();
    const dislikeActivity = await doc.docs.map((d) => d.data());
    const [did] = await doc.docs.map((d) => d.id);
    const isExisted = dislikeActivity.length > 0;
    return { isDisliked: dislikeActivity[0]?.isDisliked, did, isExisted };
  };

  static updateDislikeActivity = async (uid, tid, commentId, did, isDisliked, dislikeCount) => {
    const { id } = await this.getByUid(uid);

    if (isDisliked) {
      await col('user')
        .doc(`${id}`)
        .collection('activity')
        .doc('dislikes')
        .collection('comments')
        .doc(`${did}`)
        .update({
          isDisliked: false,
          createdAt: new Date(),
        });
      if (dislikeCount > 0) {
        await col('thread')
          .doc(`${tid}`)
          .collection('comment')
          .doc(`${commentId}`)
          .update({ dislikeCount: dislikeCount * 1 - 1 });
        console.log('Activity Existed and dislike now <unlike> and now like #decrease 1#');
      } else {
        console.log(
          'Activity Existed and disliked still the same bcuz current dislike is <0> this is to handle conflict'
        );
      }
    } else {
      await col('user')
        .doc(`${id}`)
        .collection('activity')
        .doc('dislikes')
        .collection('comments') // like on comment then will store in comment of like activity
        .doc(`${did}`)
        .update({
          isDisliked: true,
          createdAt: new Date(),
        });
      await col('thread')
        .doc(`${tid}`)
        .collection('comment')
        .doc(`${commentId}`)
        .update({ dislikeCount: dislikeCount * 1 + 1 });
      console.log('Activity Existed and not yet disliked now #increase 1#');
    }
  };

  static addDislikeActivity = async (uid, tid, commentId, dislikeActivity, dislikeCount) => {
    const { id } = await this.getByUid(uid);

    await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('dislikes')
      .collection('comments') // like on comment then will store in comment of like activity
      .add({
        ...dislikeActivity,
        isDisliked: true,
      });
    await col('thread')
      .doc(`${tid}`)
      .collection('comment')
      .doc(`${commentId}`)
      .update({ dislikeCount: dislikeCount * 1 + 1 });
    console.log('Add Dislike Activity (new) Success');
  };

  /*
                ____________________________________
               |        Thread Like Activity        |
               |____________________________________|
 */

  static getThreadLikedActivity = async (uid, tid) => {
    const { id } = await this.getByUid(uid);

    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('likes')
      .collection('threads')
      .where('tid', '==', tid)
      .limit(1)
      .get();
    const threadLikeActivity = await doc.docs.map((l) => l.data());
    const [lid] = await doc.docs.map((l) => l.id);
    const isExisted = threadLikeActivity.length > 0;
    // console.log('my activity', lid, threadLikeActivity[0]?.isLiked);
    return { isLiked: threadLikeActivity[0]?.isLiked, lid, isExisted };
  };

  static updateThreadLikeActivity = async (uid, tid, lid, isLiked, likeCount) => {
    const { id } = await this.getByUid(uid);

    if (isLiked) {
      await col('user')
        .doc(`${id}`)
        .collection('activity')
        .doc('likes')
        .collection('threads')
        .doc(`${lid}`)
        .update({
          isLiked: false,
          createdAt: new Date(),
        });
      if (likeCount > 0) {
        await col('thread')
          .doc(`${tid}`)
          .update({ likeCount: likeCount * 1 - 1, updatedAt: new Date() });
        console.log('Activity Existed and liked now  unlike and total like decrease 1');
      } else {
        console.log(
          'Activity Existed and liked still the same bcuz current like is 0 this is to handle conflict'
        );
      }
    } else {
      await col('user')
        .doc(`${id}`)
        .collection('activity')
        .doc('likes')
        .collection('threads') // like on thread then will store in thread of like activity
        .doc(`${lid}`)
        .update({
          isLiked: true,
          createdAt: new Date(),
        });
      await col('thread')
        .doc(`${tid}`)
        .update({ likeCount: likeCount * 1 + 1 });
      console.log('Activity Existed and not yet liked now added like');
    }
  };

  static addThreadLikeActivity = async (uid, tid, likeActivity, likeCount) => {
    const { id } = await this.getByUid(uid);

    await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('likes')
      .collection('threads') // like on thread then will store in thread of like activity
      .add({
        ...likeActivity,
        isLiked: true,
        createdAt: new Date(),
      });
    await col('thread')
      .doc(`${tid}`)
      .update({ likeCount: likeCount * 1 + 1, updatedAt: new Date() });
    console.log('Add Thread Like Activity (new) Success');
  };

  /*
                ____________________________________
               |      Thread Dislike Activity       |
               |____________________________________|
 */

  static getThreadDislikedActivity = async (uid, tid) => {
    const { id } = await this.getByUid(uid);

    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('dislikes')
      .collection('threads')
      .where('tid', '==', tid)
      .limit(1)
      .get();
    const dislikeActivity = await doc.docs.map((d) => d.data());
    const [did] = await doc.docs.map((d) => d.id);
    const isExisted = dislikeActivity.length > 0;
    // console.log(dislikeActivity);
    return { isDisliked: dislikeActivity[0]?.isDisliked, did, isExisted, dislikeActivity };
  };

  static updateThreadDislikeActivity = async (uid, tid, did, isDisliked, dislikeCount) => {
    const { id } = await this.getByUid(uid);

    if (isDisliked) {
      await col('user')
        .doc(`${id}`)
        .collection('activity')
        .doc('dislikes')
        .collection('threads')
        .doc(`${did}`)
        .update({
          isDisliked: false,
          createdAt: new Date(),
        });
      if (dislikeCount > 0) {
        await col('thread')
          .doc(`${tid}`)
          .update({ dislikeCount: dislikeCount * 1 - 1, updatedAt: new Date() });
        console.log('Activity Existed and liked now  unlike and total like decrease 1');
      } else {
        console.log(
          'Activity Existed and liked still the same bcuz current like is 0 this is to handle conflict'
        );
      }
    } else {
      await col('user')
        .doc(`${id}`)
        .collection('activity')
        .doc('dislikes')
        .collection('threads') // like on thread then will store in thread of like activity
        .doc(`${did}`)
        .update({
          isDisliked: true,
          createdAt: new Date(),
        });
      await col('thread')
        .doc(`${tid}`)
        .update({ dislikeCount: dislikeCount * 1 + 1, updatedAt: new Date() });
      console.log('Activity Existed and not yet liked now added like');
    }
  };

  static addThreadDislikeActivity = async (uid, tid, dislikeActivity, dislikeCount) => {
    const { id } = await this.getByUid(uid);

    await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('dislikes')
      .collection('threads') // like on thread then will store in thread of like activity
      .add({
        ...dislikeActivity,
        isDisliked: true,
      });
    await col('thread')
      .doc(`${tid}`)
      .update({ dislikeCount: dislikeCount * 1 + 1, updatedAt: new Date() });
    console.log('Add Thread Like Activity (new) Success');
  };

  /*
                ____________________________________
               |          Bookmark Activity         |
               |____________________________________|
 */

  static addBookmarkActivity = async (uid, thread) => {
    const { id } = await this.getByUid(uid);

    await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('bookmark')
      .collection('threads')
      .add({
        ...thread,
        createdAt: new Date(),
        text: '',
      });
    //  Update Text to empty string to save space db
    //  Update createdAt to the activity
  };

  static removeBookmarkActivity = async (uid, bid) => {
    const { id } = await this.getByUid(uid);

    await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('bookmark')
      .collection('threads')
      .doc(bid)
      .delete();
    //  Update Text to empty string to save space db
    //  Update createdAt to the activity
  };

  static getBookmarkActivities = async (uid) => {
    const { id } = await this.getByUid(uid);

    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('bookmark')
      .collection('threads')
      .orderBy('tid', 'desc')
      // .limit(10)
      .get();
    const threads = await doc.docs.map((thread) => ({ bid: thread.id, ...thread.data() }));
    return threads;
  };

  static getBookmarkActivities = async (uid, tid) => {
    const { id } = await this.getByUid(uid);

    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('bookmark')
      .collection('threads')
      .orderBy('tid', 'desc')
      .startAfter(`${tid}`)
      .limit(10)
      .get();

    const threads = await doc.docs.map((thread) => ({ bid: thread.id, ...thread.data() }));
    return threads;
  };

  static getBookmarkActivity = async (uid, tid) => {
    const { id } = await this.getByUid(uid);

    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('bookmark')
      .collection('threads')
      .where('tid', '==', tid)
      .limit(1)
      .get();
    const threads = await doc.docs.map((thread) => ({ bid: thread.id, ...thread.data() }));
    const isSaved = threads.length > 0;
    return { ...threads[0], isSaved };
  };

  static getCheckBookmarkActivity = async (uid, tid) => {
    const { id } = await this.getByUid(uid);

    const doc = await col('user')
      .doc(`${id}`)
      .collection('activity')
      .doc('bookmark')
      .collection('threads')
      .where('tid', '==', tid)
      .limit(1)
      .get();
    const threads = await doc.docs.map((thread) => ({ bid: thread.id, ...thread.data() }));
    const isSaved = threads.length;
    return { isSaved, threads };
  };

  static pushNotification = async (id, data) => {
    await col('user')
      .doc(`${id}`)
      .collection('notifications')
      .add({
        type: 'notification',
        ...data,
        createdAt: new Date(),
      });
  };

  static getNotifications = async (uid) => {
    const { id } = await this.getByUid(uid);
    const doc = await col('user')
      .doc(`${id}`)
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .get();
    const notifications = await doc.docs.map((notification) => ({
      nid: notification.id,
      ...notification.data(),
    }));
    return notifications;
  };

  static getBannedUserList = async () => {
    const doc = await col('user').where('status', '==', 'banned').get();
    const bannedUserList = await doc.docs.map((bannedUser) =>
      convertTimeOf({
        uid: bannedUser.id,
        ...bannedUser.data(),
      })
    );
    return bannedUserList;
  };

  static getUserList = async () => {
    const doc = await col('user').get();
    const userList = await doc.docs.map((user) =>
      convertTimeOf({
        uid: user.id,
        ...user.data(),
      })
    );
    return userList;
  };

  /*
                ____________________________________
               |          Ban User Activity         |
               |____________________________________|
 */

  static banUserWithDuration = async (uid, duration) => {
    const { id } = await this.getByUid(uid);
    await col('user').doc(`${id}`).update({
      status: 'banned',
      banDuration: duration,
      bannedAt: new Date(),
      bannedBy: 'admin',
    });
  };

  static unbanUser = async (uid) => {
    const { id } = await this.getByUid(uid);
    await col('user').doc(`${id}`).update({
      status: 'active',
      bannedBy: 'admin',
      bannedAt: '',
      banDuration: '',
    });
  };

  /*
                ____________________________________
               |        🌱 Seed User Activity       |
               |____________________________________|
 */

  static seedBanAt = async (uid) => {
    const { id } = await this.getByUid(uid);
    await col('user').doc(`${id}`).update({
      bannedAt: new Date(),
    });
    console.log('🌱Seed Ban At Success🌱', id);
  };

  static deleteBanAt = async (uid) => {
    const { id } = await this.getByUid(uid);
    await col('user').doc(`${id}`).update({
      banAt: '',
    });
    console.log('🌱Delete Ban At Success🌱', id);
  };

  static seedAllBanAt = async () => {
    const doc = await col('user').get();
    const userList = await doc.docs.map((user) => ({
      uid: user.id,
      ...user.data(),
    }));
    userList.forEach((user) => {
      this.deleteBanAt(user.uid);
    });
    return userList.length;
  };
}
