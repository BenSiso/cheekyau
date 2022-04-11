import User from '../../../model/user';

const handler = async (req, res) => {
  try {
    const { uid } = req.query;
    const user = await User.getByUid(uid);
    res.statusCode = 200;

    if (user?.type !== 'admin') {
      return res.json({
        status: 'error',
        message: 'You are not admin',
      });
    }
    return res.json({
      status: 'success',
    });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};
export default handler;
