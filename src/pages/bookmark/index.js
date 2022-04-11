import axios from 'axios';
import { withAuthUserSSR } from 'next-firebase-auth';
import initAuth from '../../services/initAuth';
import { withDomain } from '../../utilities/dev';

initAuth();
const index = (props) => {
  return props;
};

export const getServerSideProps = withAuthUserSSR()(async ({ AuthUser }) => {
  console.time('Bookmark 🧐');
  const threads = await axios(withDomain(`/api/bookmark?uid=${AuthUser.id}`)).then(
    (d) => d.data.payload.threads
  );
  console.timeEnd('Bookmark 🧐');

  const category = threads[0]?.category || null;
  return {
    props: {
      threads,
      category,
    },
  };
});
export default index;
