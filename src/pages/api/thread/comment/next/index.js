import Thread from '../../../../../model/thread';

export default async (req, res) => {
  const { tid, lastCreatedAt } = req.body;
  try {
    const comments = await Thread.getNextComments(tid, lastCreatedAt);
    res.status(200).json({
      status: 'ok',
      payload: {
        comments,
      },
    });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
