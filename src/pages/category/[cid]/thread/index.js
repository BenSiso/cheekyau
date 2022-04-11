// Redirect to category page
export default function index(props) {
  return props;
}

export async function getServerSideProps({ query }) {
  const { cid } = query;

  return {
    redirect: {
      permanent: false,
      destination: `/category/${cid}`,
    },
  };
}
