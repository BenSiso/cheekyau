import { withAuthUserSSR } from 'next-firebase-auth';
import { AdminMain } from '../../layout';
import User from '../../model/user';

const AdminPage = () => {
  return <AdminMain />;
};

export const getServerSideProps = withAuthUserSSR()(async ({ AuthUser }) => {
  const user = await User.getByUid(AuthUser.id);
  if (user?.type !== 'admin') {
    return {
      redirect: {
        destination: '/category/1',
      },
    };
  }
  return {
    props: {
      status: 'success',
    },
  };
});
export default AdminPage;
