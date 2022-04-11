import { Category } from '../../../../model';
import Thread from '../../../../model/thread';

const index = (props) => {
  return props;
};

export default index;

export async function getServerSideProps({ query }) {
  const { cid, tid } = query;
  console.time('Category/Thread/[tid] 🧐');
  const [threads, comments, thread, category] = await Promise.all([
    Thread.getByCategory(cid),
    Thread.getComments(tid),
    Thread.getById(tid),
    Category.getById(cid),
  ]);
  console.timeEnd('Category/Thread/[tid] 🧐');

  return {
    props: {
      threads: threads?.map((t) => ({ ...t, category })),
      category,
      thread,
      comments,
    },
  };
}
