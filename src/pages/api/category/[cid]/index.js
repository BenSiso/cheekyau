import Category from '../../../../model/category';

export default async (req, res) => {
  try {
    const { cid } = req.query;

    const category = await Category.getById(cid);

    res.statusCode = 200;
    res.json({
      status: 'ok',
      payload: {
        category,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Unexpected error.',
      description: error,
    });
  }
};
