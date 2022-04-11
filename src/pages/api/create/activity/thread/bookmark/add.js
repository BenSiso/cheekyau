/* eslint-disable no-console */
import User from '../../../../../../model/user';

export default async (req, res) => {
  const { thread, uid, isSaved } = req.body;

  try {
    if (!isSaved) await User.addBookmarkActivity(uid, thread);
    else {
      const { bid } = await User.getBookmarkActivity(uid, thread?.tid);
      await User.removeBookmarkActivity(uid, bid);
    }

    res.status(200).json({
      status: 'success',
      payload: {
        thread,
        uid,
        isSaved,
      },
    });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
