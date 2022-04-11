import User from '../../../../../../../model/user';

export default async (req, res) => {
  try {
    const { uid, tid } = req.body;
    // Check and Get Like Activity if available
    const likeActivity = await User.getThreadLikedActivity(uid, tid);
    const isLikedCheck = likeActivity.isExisted ? likeActivity.isLiked : false;
    res.status(200).json(isLikedCheck);
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error.', description: error });
  }
};
