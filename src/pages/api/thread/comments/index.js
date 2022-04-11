import { Thread } from '../../../../model';

export default async (req, res) => {
  try {
    const { tid } = req.query;
    const comments = await Thread.getComments(tid);
    res.status(200).json(comments);
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
