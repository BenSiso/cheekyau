/* eslint-disable no-console */
import { User } from '../../../model';

export default async (req, res) => {
  const { uid, tid } = req.query;

  try {
    const { threads, isSaved } = await User.getCheckBookmarkActivity(uid, tid * 1);

    res.statusCode = 200;
    return res.json({
      status: 'ok',
      payload: {
        threads,
        isSaved,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};
