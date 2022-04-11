import { Thread } from '../../model';

export default function Page(props) {
  return props;
}

export async function getServerSideProps() {
  console.time('All Index 🧐');
  const threads = await Thread.getAll();
  console.timeEnd('All Index 🧐');

  return {
    props: {
      threads,
    },
  };
}
