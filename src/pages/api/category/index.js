import Category from '../../../model/category';

export default async (req, res) => {
  try {
    const categories = await Category.getCategoryList();
    res.statusCode = 200;
    res.json({
      status: 'ok',
      payload: {
        categories,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Unexpected error.',
      description: error,
    });
  }
};
