import moment from 'moment';
import Thread from '../../../../../../model/thread';
import User from '../../../../../../model/user';

export default async (req, res) => {
  try {
    const { tid, text, uid, createdAt, threadOwner } = req.body;

    const [thread, user] = await Promise.all([Thread.getThread(tid), User.getByUid(uid)]);

    if (user.banDuration !== '' && moment(user.banDuration).isAfter(moment())) {
      res.status(200).json({ status: 'banned', banDuration: user.banDuration });
      return;
    }

    const dislikeActivity = {
      tid,
      text,
      dislikeCount: thread?.dislikeCount,
      uid,
      createdAt,
      threadOwner,
    };

    await User.addThreadDislikeActivity(uid, tid, dislikeActivity, thread?.dislikeCount);

    res.status(200).json({
      status: 'success',
      dislikeCount: thread?.dislikeCount,
      isDisliked: true,
    });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
