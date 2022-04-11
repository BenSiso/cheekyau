/* eslint-disable no-console */
import User from '../../../model/user';

export default async (req, res) => {
  const { uid } = req.query;
  try {
    const threads = await User.getBookmarkActivities(uid);
    res.statusCode = 200;
    return res.json({
      status: 'ok',
      payload: {
        threads,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};
