import { User } from '../../../model';

const handler = async (req, res) => {
  try {
    const { uid } = req.query;
    const notifications = await User.getNotifications(uid);
    res.json({ status: 'OK', notifications });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};

export default handler;
