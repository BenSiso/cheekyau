import { Thread } from '../../model';
import { startTimer } from '../../utilities/dev';

export default function index(props) {
  return props;
}

export async function getStaticProps() {
  const end = startTimer('pop');
  const threads = await Thread.getPopular();
  end();
  return {
    revalidate: 30,
    props: {
      threads,
    },
  };
}
