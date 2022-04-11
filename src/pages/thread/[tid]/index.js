/* eslint-disable dot-notation */
import axios from 'axios';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { showAddAsAppBannerState } from '../../../recoil';
import { withDomain } from '../../../utilities/dev';

export default function index(props) {
  const setShowAddAsAppBanner = useSetRecoilState(showAddAsAppBannerState);

  useEffect(() => {
    const getBanner = localStorage.getItem('bannerConfig');
    const banner = JSON.parse(getBanner) || false;

    if (banner && banner.value) {
      setShowAddAsAppBanner(true);
    }
  }, []);

  return props;
}

export async function getServerSideProps({ query: { tid } }) {
  const { comments, thread } = await axios(withDomain(`/api/thread/${tid}`)).then(
    (d) => d?.data?.payload
  );
  const cid = thread?.category?.id;
  const { threads, category } = await axios(withDomain(`/api/category/${cid || 1}/thread`)).then(
    (d) => d?.data?.payload
  );

  return {
    props: {
      thread,
      threads,
      comments,
      category,
    },
  };
}
