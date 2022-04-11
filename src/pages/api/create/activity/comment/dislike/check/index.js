import User from '../../../../../../../model/user';

export default async (req, res) => {
  try {
    const { commentId, uid } = req.body;
    // Check and Get Like Activity if available
    const dislikeActivity = await User.getDislikedActivity(commentId, uid);
    const isDislikedCheck = dislikeActivity.isExisted ? dislikeActivity.isDisliked : false;
    res.status(200).json(isDislikedCheck);
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error.', description: error });
  }
};
