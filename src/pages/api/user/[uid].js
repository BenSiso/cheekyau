import User from '../../../model/user';

const handler = async (req, res) => {
  try {
    const { uid } = req.query;
    const data = await User.getByUid(uid);
    return res.json({
      status: 'success',
      user: data,
    });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};
export default handler;
