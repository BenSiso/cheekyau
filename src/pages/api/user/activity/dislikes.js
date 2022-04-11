import User from '../../../../model/user';

const handler = async (req, res) => {
  try {
    if (req.query.cmt) {
      console.time('getUserCommentIdsList - DISLIKE 🧐');
      const dislikedIds = await User.getCommentIdsDislikedActivity(req.query.cmt);
      res.json(dislikedIds);
      console.timeEnd('getUserCommentIdsList - DISLIKE 🧐');

      return;
    }
    res.json(200).send('No Authorized');
  } catch (error) {
    res.status(500).json({
      status: 'Unexpected Error',
      description: error.message,
    });
  }
};

export default handler;
