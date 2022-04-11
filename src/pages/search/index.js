import axios from 'axios';
// import Main from '../../layout/Main';
import { withDomain } from '../../utilities/dev';

export default function index(props) {
  return props;
}

export async function getServerSideProps({ query: { q } }) {
  const threads = await axios(withDomain(`/api/search?q=${q}`)).then(
    (d) => d.data?.payload?.threads
  );
  return {
    props: {
      threads,
    },
  };
}
