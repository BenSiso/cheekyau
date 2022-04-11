import { col } from '../../../../services/db';

export default async (req, res) => {
  try {
    // Can add other data from post req
    const { nickname, gender, email, alternateEmail, uid } = req.body;

    // Generate increment userId
    const users = await col('user').orderBy('id', 'desc').limit(1).get();
    const usersData = users.docs.map((user) => user.id);
    const userId = usersData * 1 + 1;

    // User data for uploading to user collection
    const user = {
      id: `${userId}`,
      nickname,
      nicknameLower: nickname.toLowerCase(),
      email,
      gender,
      alternateEmail,
      uid,
      type: 'user',
      status: 'active',
      registeredAt: new Date(),
    };

    // Handle Existing Account
    const userNameCheck = await col('user')
      .where('nicknameLower', '==', nickname.toLowerCase())
      .limit(1)
      .get();
    const userEmailCheck = await col('user').where('email', '==', email).limit(1).get();
    const nameCheck = userNameCheck.docs.map((userCheck) => userCheck.data()).length > 0;
    const emailCheck = userEmailCheck.docs.map((userCheck) => userCheck.data()).length > 0;
    if (nameCheck || emailCheck) {
      res.status(400).send('account already exists').end();
    } else {
      // Upload to user collection
      await col('user')
        .doc(`${userId}`)
        .set({
          ...user,
        });
      res.status(200).json(user);
    }
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
