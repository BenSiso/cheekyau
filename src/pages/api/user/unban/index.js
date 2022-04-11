import User from '../../../../model/user';

const handler = async (req, res) => {
  try {
    const { uid, id } = req.body;
    const user = await User.getByUid(id);
    if (user?.type !== 'admin') {
      return res.status(500).json({
        status: 'error',
        message: 'You are not admin',
      });
    }
    await User.unbanUser(uid);
    return res.json({ status: 'success', message: 'unbanned' });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};

export default handler;
