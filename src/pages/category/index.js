import { Category, Thread } from '../../model';

export default function Page(props) {
  return props;
}

export async function getServerSideProps() {
  console.time('Category Index 🧐');
  const [threads, category] = await Promise.all([Thread.getByCategory(1), Category.getById(1)]);
  console.timeEnd('Category Index 🧐');

  return {
    props: {
      threads: threads?.map((t) => ({ ...t, category })),
      category,
    },
  };
}
