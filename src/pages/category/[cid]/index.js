/* eslint-disable no-unused-vars */

import { Category, Thread } from '../../../model';

export default function Page(props) {
  return props;
}

export async function getServerSideProps({ query }) {
  const { cid } = query;
  console.time('Category/[cid] 🧐');
  const [threads, category] = await Promise.all([Thread.getByCategory(cid), Category.getById(cid)]);
  console.timeEnd('Category/[cid] 🧐');

  return {
    props: {
      threads: threads?.map((t) => ({ ...t, category })),
      category,
    },
  };
}
