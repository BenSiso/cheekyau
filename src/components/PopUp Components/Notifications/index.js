/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRequest } from 'ahooks';
import axios from 'axios';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useAuthUser } from 'next-firebase-auth';
import Link from 'next/link';
import { ImBin, ImUser } from 'react-icons/im';
import { IoClose } from 'react-icons/io5';
import { useSetRecoilState } from 'recoil';
import { showNotificationState } from '../../../recoil';

const index = () => {
  const AuthUser = useAuthUser();
  const setShowNotificationBox = useSetRecoilState(showNotificationState);
  const onGetNotifications = async () => {
    const res = await axios.get(`/api/notifications?uid=${AuthUser.id}`);
    return res.data.notifications;
  };
  const { data: notifications } = useRequest(onGetNotifications, {
    pollingInterval: 60 * 1000,
    cacheTime: 600 * 1000,
  });

  return (
    <motion.div
      className='fixed bg-top-nav-dark h-full w-full top-0 bottom-0 right-0 left-0 z-20 m-auto 2xl:max-w-md lg:max-w-lg max-w-md text-white shadow-2xl rounded-md'
      animate={{ y: ['100%', '0%'] }}
      transition={{ duration: 0.5 }}
      initial={{ y: '100%' }}
      exit={{ y: '100%' }}
    >
      <div className='flex justify-between h-14 bg-top-nav-dark rounded-t-md'>
        <div className='text-white font-bold text-xl ml-4 self-center align-middle'>
          Notifications
        </div>
        <button
          onClick={() => {
            setShowNotificationBox(false);
          }}
          type='button'
          className='text-white text-3xl h-14 px-4 hover:bg-third transition duration-300'
        >
          <IoClose />
        </button>
      </div>
      <div className='bg-side-bar-dark h-full flex flex-col space-y-1 py-4'>
        {/* Notification List */}
        {notifications?.length > 0 &&
          notifications.map((notify) => {
            return (
              <Link key={notify.id} href={`/thread/${notify.tid}`}>
                <div
                  className='flex p-4 bg-third cursor-pointer text-primary hover:bg-setting-column transition duration-300'
                  onClick={() => {
                    setShowNotificationBox(false);
                  }}
                >
                  <div className='flex flex-row w-full space-x-4'>
                    <div className='bg-purple-300 rounded-full h-7 w-7 text-lg'>
                      <ImUser className=' relative ml-1.5 mt-1' />
                    </div>
                    <div className='flex flex-col'>
                      <div className='space-x-2'>
                        <span>{notify.commenter?.nickname}</span>
                        <span>&bull;</span>
                        <span className='text-sm font-extralight opacity-60'>
                          {moment().from(notify.createdAt)}
                        </span>
                      </div>
                      <div className='text-sm text-third whitespace-pre-line truncate'>
                        Replied to thread: <span className='font-bold'>{notify.thread.title}</span>
                      </div>
                    </div>
                  </div>
                  <ImBin className='text-xl mt-2.5 text-red-500' />
                </div>
              </Link>
            );
          })}
        {/* Setting Box */}

        <button
          type='button'
          className='absolute bottom-0 w-full flex py-4 bg-third cursor-pointer text-red-500 hover:text-red-600 hover:bg-setting-column justify-center transition duration-300 rounded-b-md'
          onClick={() => {}}
        >
          <div className='px-4 text-center'>Clear</div>
        </button>
      </div>
    </motion.div>
  );
};

export default index;
