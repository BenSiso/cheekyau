import moment from 'moment';
import User from '../../../../model/user';

const handler = async (req, res) => {
  try {
    const { id, uid, duration } = req.body;
    const user = await User.getByUid(id);
    if (user?.type !== 'admin') {
      return res.status(500).json({
        status: 'error',
        message: 'You are not admin',
      });
    }
    let banTime = moment().add(duration, 'days');
    if (duration === '-1') {
      banTime = moment().add(100, 'years');
    } else {
      banTime = moment().add(duration, 'days');
    }
    await User.banUserWithDuration(uid, banTime);
    return res.json({ status: 'success', message: 'banned' });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};

export default handler;
