/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { showLoginBoxState, showSideBarState } from '../../recoil';
import {
  CKAll,
  CKBookmark,
  CKCustomerSupport,
  CKEducation,
  CKFashion,
  CKGaming,
  CKHealth,
  CKHistory,
  CKNews,
  CKPopular,
  CKRelationship,
  CKSport,
} from '../Icons';

export default function LeftNavFull({ categories }) {
  const authUser = useAuthUser();
  const iconList = [
    <CKNews />,
    <CKSport />,
    <CKRelationship />,
    <CKEducation />,
    <CKHealth />,
    <CKFashion />,
    <CKGaming />,
  ];
  const router = useRouter();
  const setShowLeftNav = useSetRecoilState(showSideBarState);
  const setShowLogin = useSetRecoilState(showLoginBoxState);
  const onCloseFullLeftNav = (route) => {
    // ! Handle User Auth when click Bookmark Icon
    if (route.includes('bookmark') && !authUser.id) {
      setShowLogin(true);
    } else {
      setShowLeftNav(false);
      router.push(route);
    }
  };
  return (
    <>
      <div className='flex flex-col px-2 pt-10 pb-4 text-white'>
        <div
          className='flex space-x-4 items-center mb-2 py-2 px-4 hover:bg-gray-800 cursor-pointer rounded-lg text-white'
          onClick={() => onCloseFullLeftNav('/history')}
        >
          <div className='w-10 h-10 text-white text-2xl flex justify-center items-center'>
            <CKHistory w='25' h='25' />
          </div>
          <div>History</div>
        </div>
        <div
          className='flex space-x-4 items-center mb-2 py-2 px-4 hover:bg-gray-800 cursor-pointer rounded-lg text-white'
          onClick={() => onCloseFullLeftNav('/bookmark')}
        >
          <div className='w-10 h-10 text-white text-2xl flex justify-center items-center'>
            <CKBookmark w='25' h='25' />
          </div>
          <div>Bookmark</div>
        </div>
        <div
          className='flex space-x-4 items-center mb-2 py-2 px-4 hover:bg-gray-800 cursor-pointer rounded-lg '
          onClick={() => onCloseFullLeftNav('/all')}
        >
          <div className='w-10 h-10 text-2xl rounded-3xl bg-third text-white flex items-center justify-center'>
            <CKAll w='23' h='25' />
          </div>
          <div>ALL</div>
        </div>
        <div
          className='flex space-x-4 items-center mb-2 py-2 px-4 hover:bg-gray-800 cursor-pointer rounded-lg'
          onClick={() => onCloseFullLeftNav('/popular')}
        >
          <div className='w-10 h-10 text-2xl rounded-3xl bg-third text-white flex items-center justify-center'>
            <CKPopular w='25' h='25' />
          </div>
          <div>Popular</div>
        </div>
      </div>
      <div className='flex justify-center pb-4'>
        <div className='border-b border-gray-700 w-4/5' />
      </div>
      <p className='text-xl text-white text-opacity-60 p-4'>Categories</p>
      <div className='flex flex-col px-2 py-4'>
        {categories?.map((category, idx) => (
          <div
            key={category?.id}
            className='flex items-center space-x-4 mt-2 py-2 px-4 hover:bg-gray-800 cursor-pointer rounded-lg text-white'
            onClick={() => onCloseFullLeftNav(`/category/${category?.id}`)}
          >
            <div className='w-10 h-10 bg-third text-white text-2xl rounded-3xl flex justify-center items-center'>
              {iconList[idx]}
            </div>
            <div>{category.name}</div>
          </div>
        ))}
        <div className='flex items-center space-x-4 mt-2 py-2 px-4 hover:bg-gray-800 cursor-pointer rounded-lg text-white'>
          <div className='w-10 h-10 bg-third text-white text-2xl rounded-3xl flex justify-center items-center'>
            <CKCustomerSupport />
          </div>
          <div>Help Center</div>
        </div>
      </div>
    </>
  );
}
