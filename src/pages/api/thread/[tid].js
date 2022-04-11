import { Thread } from '../../../model';

export default async (req, res) => {
  try {
    const { tid } = req.query;

    const [thread, comments] = await Promise.all([Thread.getById(tid), Thread.getComments(tid)]);

    res.status(200).json({
      status: 'ok',
      payload: {
        thread,
        comments,
      },
    });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
