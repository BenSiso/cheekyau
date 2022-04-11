import Banner from '../../../../model/banner';

const handler = async (req, res) => {
  try {
    const banner = await Banner.getOnceBanner();
    return res.json({ status: 'success', payload: banner });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};

export default handler;
