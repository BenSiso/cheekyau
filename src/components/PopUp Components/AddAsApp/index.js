import { useEffect } from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { HiOutlinePlus } from 'react-icons/hi';
import { IoIosArrowForward } from 'react-icons/io';
import { VscChromeClose } from 'react-icons/vsc';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { showAddAsAppBannerState } from '../../../recoil';
import * as ResponsiveState from '../../../recoil/responsive';
import { useWindowSize } from '../../../utilities/hooks';

const AddAsApp = () => {
  const [isSmallMobile, setIsSmallMobile] = useRecoilState(ResponsiveState.isSmallMobileSizeState);

  // Checking mobile state
  const [x, y] = useWindowSize();
  useEffect(() => {
    if (x < 321 && y < 734) {
      setIsSmallMobile(true);
    } else {
      setIsSmallMobile(false);
    }
  }, [x, y]);

  const setShowAddAsAppBanner = useSetRecoilState(showAddAsAppBannerState);

  const onCloseAddAsApp = () => {
    setShowAddAsAppBanner(false);
    const getBnObj = localStorage.getItem('bannerConfig');
    const bnObj = JSON.parse(getBnObj);
    const newBnObj = { value: false, timestamp: bnObj.timestamp, isCreated: true };
    localStorage.setItem('bannerConfig', JSON.stringify(newBnObj));
  };

  const onLogoCircle = () => {
    // eslint-disable-next-line dot-notation
  };
  return (
    <div className='relative flex flex-col bg-white rounded-xl h-40 p-4' style={{ width: '90%' }}>
      <div className='flex flex-row flex-1 w-full h-full text-base text-black font-bold'>
        <div className='mx-auto'>
          <p className='pr-6'>Quick add this as app!</p>
        </div>
        <div className='flex absolute items-center justify-center rounded-full  bg-banner-exit cursor-pointer w-8 h-8 right-4 top-2'>
          <VscChromeClose
            style={{ color: 'white', strokeWidth: '1' }}
            size={isSmallMobile ? 16 : 18}
            onClick={onCloseAddAsApp}
            className='m-auto'
          />
        </div>
      </div>
      <div className='flex-1 flex items-center justify-center w-full h-full mt-2'>
        {/* Click Icon */}
        <div className='flex flex-col mb-4'>
          <div
            className={`${
              isSmallMobile ? 'h-14 w-14 ' : 'h-16 w-16 '
            } flex  items-center justify-center rounded-full  bg-gray-200 cursor-pointer`}
          >
            <BiLogInCircle size={40} style={{ color: '#7988F2' }} onClick={onLogoCircle} />
          </div>

          <div
            className={`relative flex-1 flex flex-col items-center right-0 ${
              isSmallMobile ? 'text-xs' : 'text-sm'
            }`}
          >
            <p>Click </p>
          </div>
        </div>

        <div
          className={`flex h-full items-center justify-center pb-7  ${
            isSmallMobile ? 'px-1' : 'px-2'
          }`}
        >
          <IoIosArrowForward size={24} color='rgb(231,231,231)' />
        </div>

        {/* Add to table Icon */}
        <div className='flex flex-col'>
          <div
            className={`${
              isSmallMobile ? 'h-14 w-14 ' : 'h-16 w-16 '
            } flex  items-center justify-center rounded-full  bg-banner-add cursor-pointer`}
          >
            <div
              className={`${
                isSmallMobile ? 'h-8 w-8 ' : 'h-10 w-10 '
              } flex items-center justify-center rounded-full  bg-banner-icon`}
            >
              <HiOutlinePlus size={24} color='white' />
            </div>
          </div>

          <div
            className={`relative flex-1 flex flex-col items-center right-0 ${
              isSmallMobile ? 'text-xs' : 'text-sm'
            }`}
          >
            <p>Add to </p>
            <p>table</p>
          </div>
        </div>
        <div
          className={`flex h-full items-center justify-center pb-7 ${
            isSmallMobile ? 'px-1' : 'px-2'
          }`}
        >
          <IoIosArrowForward size={24} color='rgb(231,231,231)' />
        </div>

        {/* Add Cheeky Icons */}

        <div className='flex flex-col'>
          <div
            className={`${
              isSmallMobile ? 'h-14 w-14 ' : 'h-16 w-16 '
            } flex  items-center justify-center rounded-full  bg-gray-200 cursor-pointer`}
          >
            <div
              className={`${
                isSmallMobile ? 'w-8 h-8 ' : 'w-10 h-10 '
              }  bg-third p-2 rounded-lg  hover:opacity-60`}
            >
              <img
                className='flex-none '
                src='https://firebasestorage.googleapis.com/v0/b/cheeky-web.appspot.com/o/logo%2FCheeky%20head.png?alt=media&token=e6413472-b48d-4177-aa2c-5c8c4bede587'
                alt=''
              />
            </div>
          </div>
          <div
            className={`relative flex-1 flex flex-col items-center right-0 ${
              isSmallMobile ? 'text-xs' : 'text-sm'
            }`}
          >
            <p>Add </p>
            <p>Cheeky</p>
          </div>
        </div>
      </div>
      <div className={`flex-1 flex flex-row px-4 ${isSmallMobile ? 'text-xs' : 'text-sm'}`} />
    </div>
  );
};

export default AddAsApp;
