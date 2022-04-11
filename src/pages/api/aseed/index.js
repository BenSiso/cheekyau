import { Thread } from '../../../model';

const handler = async (req, res) => {
  try {
    // const total = await Thread.onSeedCommentCountFieldAllThread();
    // res.status(200).json(`🌱 Seed Comment Count >>>Total = ${total} Completed ✅ 🌱 `);

    // const total = await User.seedAllBanAt();
    const total = await Thread.seedTimeConvertComments();
    res
      .status(200)
      .json(
        `🌱 Seed All Ban At >>>Total = ${total.threadList} ${total.totalThread} Completed ✅ 🌱 `
      );
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};
export default handler;
