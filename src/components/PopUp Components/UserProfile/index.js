import { motion } from 'framer-motion';
import { useAuthUser } from 'next-firebase-auth';
import { ImUser } from 'react-icons/im';
import { IoIosArrowForward } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { useSetRecoilState } from 'recoil';
import { showUserProfileState } from '../../../recoil';

const index = () => {
  const setShowUserProfile = useSetRecoilState(showUserProfileState);
  const AuthUser = useAuthUser();
  return (
    <motion.div
      className='fixed bg-white h-full w-full z-20'
      animate={{ y: ['100%', '0%'] }}
      transition={{ duration: 0.5 }}
      initial={{ y: '100%' }}
      exit={{ y: '100%' }}
    >
      <div className='flex justify-between h-14 bg-top-nav-dark'>
        <div className='text-white font-bold text-xl ml-4 self-center align-middle'>
          User Profile
        </div>
        <button
          type='button'
          className='text-white text-3xl h-14 px-4 hover:bg-third transition duration-300'
          onClick={() => setShowUserProfile(false)}
        >
          <IoClose />
        </button>
      </div>
      <div className='bg-side-bar-dark h-full flex flex-col space-y-4 py-4'>
        {/* Profile Box */}
        <div className='flex py-4 bg-third cursor-pointer text-primary hover:bg-setting-column transition duration-300'>
          <div className='px-4 flex flex-row w-full space-x-6'>
            <div className='bg-gray-400 rounded-full h-12 w-12 text-4xl'>
              <ImUser className=' relative ml-1.5 mt-1' />
            </div>
            <div className='flex flex-col'>
              <div>{AuthUser.displayName || 'Username'}</div>
              <div className='text-sm text-third'>#{AuthUser.email || 168}</div>
            </div>
          </div>
          <IoIosArrowForward className='text-3xl mt-2.5' />
        </div>
        {/* Setting Box */}
        <div className='flex py-4 bg-third cursor-pointer text-primary hover:bg-setting-column transition duration-300'>
          <div className='px-4'>Settings</div>
        </div>
        <button
          type='button'
          className='flex py-4 bg-third cursor-pointer text-red-500 hover:text-red-600 hover:bg-setting-column justify-center transition duration-300'
          onClick={() => {
            AuthUser.signOut();
            setShowUserProfile(false);
          }}
        >
          <div className='px-4 text-center'>Sign Out</div>
        </button>
      </div>
    </motion.div>
  );
};

export default index;
