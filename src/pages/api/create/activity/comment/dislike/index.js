import moment from 'moment';
import Thread from '../../../../../../model/thread';
import User from '../../../../../../model/user';

export default async (req, res) => {
  try {
    const { commentId, tid, text, uid, createdAt, commentOwner } = req.body;

    const [comment, user] = await Promise.all([
      Thread.getComment(tid, commentId),
      User.getByUid(uid),
    ]);
    if (user.banDuration !== '' && moment(user.banDuration).isAfter(moment())) {
      res.status(200).json({ status: 'banned', banDuration: user.banDuration });
      return;
    }
    const dislikeActivity = {
      tid,
      commentId,
      text,
      dislikeCount: comment?.dislikeCount,
      uid,
      createdAt,
      commentOwner,
    };

    await User.addDislikeActivity(uid, tid, commentId, dislikeActivity, comment?.dislikeCount);

    res.status(200).json({
      status: 'success',
      dislikeCount: comment?.dislikeCount,
      isDisliked: true,
    });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
