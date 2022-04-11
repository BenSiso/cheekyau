import User from '../../../../../../../model/user';

export default async (req, res) => {
  try {
    const { commentId, uid } = req.body;

    // Check and Get Like Activity if available
    const likeActivity = await User.getLikedActivity(commentId, uid);
    const isLikedCheck = likeActivity.isExisted ? likeActivity.isLiked : false;
    // console.log('check from api isExited', likeActivity.isExisted);
    res.status(200).json(isLikedCheck);
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error.', description: error });
  }
};
