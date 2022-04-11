import moment from 'moment';
import { Thread } from '../../../../model';
import User from '../../../../model/user';
import media from '../../../../services/media';

export default async (req, res) => {
  try {
    // Data from body post request
    // TODO Pass Comment Count Through Property
    const { tid, text, uid } = req.body;

    // Current User
    const user = await User.getByUid(uid);
    if (moment(user?.banDuration).isAfter(moment())) {
      res.status(200).json({ status: 'banned', banDuration: user?.banDuration });
      return;
    }
    // Comment data for uploading to database
    const comment = {
      text: await media().processImagesBase64(String(text)),
      tid,
      likeCount: 0,
      dislikeCount: 0,
      replyCount: 0,
      user,
    };
    const thread = await Thread.getById(tid);

    const dataNotification = {
      uid: thread.user.uid,
      tid,
      thread,
      commenter: user,
    };
    if (tid && thread.user.id) {
      await Thread.replyComment(tid, comment, thread.commentCount);
      if (thread.user.id.toString() !== user.id.toString()) {
        await User.pushNotification(thread.user.id, dataNotification);
      }
      res.status(200).json({ status: 'success', comment });
      return;
    }

    res.status(200).json({ status: 'failed' });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};
