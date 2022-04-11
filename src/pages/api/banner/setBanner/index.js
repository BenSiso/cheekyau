import Banner from '../../../../model/banner';
import User from '../../../../model/user';

const handler = async (req, res) => {
  try {
    const { banner, id } = req.body;
    const user = await User.getByUid(id);
    if (user?.type !== 'admin') {
      return res.status(500).json({
        status: 'error',
        message: 'You are not admin',
      });
    }
    await Banner.setBanner(banner);
    return res.json({ status: 'success', payload: banner });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};

export default handler;
