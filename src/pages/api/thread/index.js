import Thread from '../../../model/thread';

export default async (req, res) => {
  try {
    const { status } = req.query;
    if (status === 'all') {
      const threads = await Thread.getAll();
      return res.status(200).json({
        status: 'ok',
        payload: {
          threads,
        },
      });
    }
    if (status === 'popular') {
      const threads = await Thread.getPopular();
      return res.status(200).json({
        status: 'ok',
        payload: {
          threads,
        },
      });
    }
    return res.status(404).json({
      status: 'failed',
      message: 'Thread Not Found or Wrong Query',
    });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};
