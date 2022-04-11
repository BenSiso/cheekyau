import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import SignInBox from '../../components/Auth/register/SignInBox';
import { routeState } from '../../recoil';

export default function index() {
  const setRoutes = useSetRecoilState(routeState);
  useEffect(() => {
    setRoutes((prev) => ({ ...prev, isRegisterPath: true }));
  });
  return <SignInBox />;
}
