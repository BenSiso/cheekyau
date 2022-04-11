import User from '../../../../model/user';

const handler = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.getByUid(id);
    if (user?.type !== 'admin') {
      return res.status(500).json({
        status: 'error',
        message: 'You are not admin',
      });
    }
    const data = await User.getBannedUserList();
    return res.json({ status: 'success', data });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};

export default handler;
