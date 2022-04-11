import User from '../../../model/user';

const handler = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.getByUid(id);
    const data = await User.getUserList();
    res.statusCode = 200;
    if (user?.type !== 'admin') {
      return res.json({
        status: 'error',
        message: 'You are not admin',
      });
    }
    return res.json({
      status: 'success',
      user: data,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unexpected error.', description: error });
  }
};
export default handler;
