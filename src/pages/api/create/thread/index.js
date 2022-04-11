import moment from 'moment';
import { Thread } from '../../../../model';
import User from '../../../../model/user';
import { col } from '../../../../services/db';
import media from '../../../../services/media';

export default async (req, res) => {
  try {
    const { cid, title, text, uid } = req.body;
    // Current Thread Data
    const [lastTid, user] = await Promise.all([Thread.getLastTid(), User.getByUid(uid)]);
    const tid = lastTid + 1;

    // Current User
    if (user.banDuration !== '' && moment(user.banDuration).isAfter(moment())) {
      res.status(200).json({ status: 'banned', banDuration: user.banDuration });
      return;
    }
    // Data for adding to database
    const thread = {
      tid,
      cid,
      title,
      text: await media().processImagesBase64(text),
      likeCount: 0,
      dislikeCount: 0,
      commentCount: 0,
      user,
    };

    // Fetch Thread Data again avoid multiple request from multiple user
    const threadsVerify = await col('thread').orderBy('tid', 'desc').limit(2).get();
    const threadVerifyData = threadsVerify.docs.map((t) => t.data());

    if (threadVerifyData.some((t) => t.tid === tid)) {
      res.status(200).json({ status: 'failed', message: 'Thread already exist' });
      return;
    }
    await Thread.add(tid, thread);
    res.status(200).json({ status: 'success' });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
