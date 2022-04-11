import { col } from '../services/db';

export default class Category {
  static getById = async (id) => {
    const doc = await col('category').doc(id).get();
    return {
      id: doc.id,
      ...doc.data(),
    };
  };

  static getCategoryList = async () => {
    const docs = await col('category').get();
    return docs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };
}
