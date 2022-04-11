import User from '../../../../model/user';

const handler = async (req, res) => {
  try {
    if (req.query.cmt) {
      console.time('getUserCommentIdsList - LIKE 🧐');
      const likedIds = await User.getCommentIdsLikedActivity(req.query.cmt);
      res.json(likedIds);
      console.timeEnd('getUserCommentIdsList - LIKE 🧐');

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
