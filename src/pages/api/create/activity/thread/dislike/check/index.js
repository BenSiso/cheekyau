import User from '../../../../../../../model/user';

export default async (req, res) => {
  try {
    const { tid, uid } = req.body;
    // Check and Get Like Activity if available
    const dislikeActivity = await User.getThreadDislikedActivity(uid, tid);
    const isDislikedCheck = dislikeActivity.isExisted ? dislikeActivity.isDisliked : false;
    res.status(200).json(isDislikedCheck);
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error.', description: error });
  }
};
