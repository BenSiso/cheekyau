import { col } from '../services/db';

export default class Banner {
  static getOnceBanner = async () => {
    const doc = await col('banner').doc('1').get();
    return {
      id: doc.id,
      ...doc.data(),
    };
  };

  static setBanner = async (banner) => {
    await col('banner').doc('1').set(banner, { merge: true });
  };
}
