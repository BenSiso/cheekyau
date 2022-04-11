import { Thread } from '../../../../model';
import Category from '../../../../model/category';

export default async (req, res) => {
  try {
    const { cid } = req.query;
    const [category, threads] = await Promise.all([
      Category.getById(cid),
      Thread.getByCategory(cid),
    ]);
    res.json({
      status: 'ok',
      payload: {
        category,
        threads,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Unexpected error.',
      description: error,
    });
  }
};
