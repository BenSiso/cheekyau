import { useRequest } from 'ahooks';
import axios from 'axios';
import Image from 'next/image';
import { withDomain } from '../../utilities/dev';

const WelcomePage = () => {
  const onGetBanner = async () => {
    const res = await axios(withDomain(`/api/banner/getBanner`));

    return res.data.payload;
  };

  const { data: banner, loading: fetchingBanner } = useRequest(onGetBanner, {
    defaultParams: [],
  });

  return (
    <div className='text-center'>
      <div className='w-full h-full'>
        {/* Banner Page */}
        <div className='p-10'>
          {!fetchingBanner && banner?.imageUrl && (
            <Image
              layout='responsive'
              src={banner?.imageUrl}
              alt='banner'
              className='rounded object-cover h-96 w-full'
              width={1280}
              height={720}
            />
          )}
          <h2 className='text-2xl font-bold text-white mt-4 text-left'>{`${
            banner?.content || ''
          }`}</h2>
        </div>
        {/* Footer Copyright */}
        <div className='w-full px-40'>{/* <p>Footer Here</p> */}</div>
      </div>
    </div>
  );
};

export default WelcomePage;
