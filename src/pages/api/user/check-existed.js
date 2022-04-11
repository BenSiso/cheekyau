import User from '../../../model/user';

const handler = async (req, res) => {
  try {
    const { uid } = req.query;
    const user = await User.getByUid(uid);
    if (user?.email) {
      res.status(200).send(true);
      return;
    }
    res.status(200).send(false);
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};

export default handler;
