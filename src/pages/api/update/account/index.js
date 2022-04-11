import { col } from '../../../../services/db';

export default async (req, res) => {
  try {
    const { nickname, email, login } = req.body;
    let userId;

    // Generate increment userId
    const users = await col('user').where('email', '==', email).get();
    if (users.empty) {
      return res.status(400).end();
    }
    users.forEach((doc) => {
      userId = doc.id;
    });

    if (login) {
      await col('user').doc(userId).update({
        loginedAt: new Date(),
      });
    } else {
      await col('user').doc(userId).update({
        nickname,
      });
    }
    return res.status(200).json('success');
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.', description: e.message });
  }
};
