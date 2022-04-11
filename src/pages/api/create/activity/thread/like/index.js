import moment from 'moment';
import Thread from '../../../../../../model/thread';
import User from '../../../../../../model/user';

export default async (req, res) => {
  try {
    const { tid, text, uid, threadOwner } = req.body;

    const [thread, user] = await Promise.all([Thread.getThread(tid), User.getByUid(uid)]);

    if (user.banDuration !== '' && moment(user.banDuration).isAfter(moment())) {
      res.status(200).json({ status: 'banned', banDuration: user.banDuration });
      return;
    }
    const likeActivity = {
      tid,
      text,
      likeCount: thread?.likeCount,
      uid,
      createdAt: new Date(),
      threadOwner,
    };
    await User.addThreadLikeActivity(uid, tid, likeActivity, thread?.likeCount);

    res.status(200).json({ status: 'success', likeCount: thread?.likeCount, isLiked: true });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
