/* eslint-disable no-console */

import { User } from '../../../../../../model';

export default async (req, res) => {
  const { uid, tid } = req.body;

  try {
    const { isSaved } = await User.getCheckBookmarkActivity(uid, tid * 1);
    res.status(200).json({
      status: 'ok',
      isSaved,
    });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
