import Thread from '../../../../../model/thread';

export default async (req, res) => {
  try {
    const { tid, commentId } = req.query;
    const count = await Thread.onReplyCount(tid, commentId);
    res.status(200).json(count);
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
