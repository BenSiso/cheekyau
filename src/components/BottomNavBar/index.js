import { useRequest } from 'ahooks';
import axios from 'axios';
import { useAuthUser } from 'next-firebase-auth';
import { AiOutlineMenu, AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { FaSignInAlt } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { RiUser3Fill } from 'react-icons/ri';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { showNotificationState } from '../../recoil';
import { showLoginBoxState } from '../../recoil/auth';
import { showCreatePostState } from '../../recoil/post/atom';
import * as SideBarState from '../../recoil/sidebar';
import * as ThreadState from '../../recoil/thread';

const BottomNav = ({ thread }) => {
  const AuthUser = useAuthUser();

  // Request API
  const onGetNotifications = async () => {
    const res = await axios.get(`/api/notifications?uid=${AuthUser.id}`);
    return res.data.notifications;
  };
  const { data: notifications, loading: isNotifyLoading } = useRequest(onGetNotifications, {
    pollingInterval: 60 * 1000,
  });

  const setShowCreatePost = useSetRecoilState(showCreatePostState);
  const setShowLoginBox = useSetRecoilState(showLoginBoxState);
  const [showSideBar, setShowSideBar] = useRecoilState(SideBarState.showSideBarState);
  const [showSearchBar, setShowSearchBar] = useRecoilState(SideBarState.showSearchBarState);
  // Recoil Atom State
  const setThreadId = useSetRecoilState(ThreadState.threadIdState);
  const setThreadTitle = useSetRecoilState(ThreadState.threadTitleState);
  const setIsCreateThread = useSetRecoilState(ThreadState.isCreateThreadState);
  const setIsReplyThread = useSetRecoilState(ThreadState.isReplyThreadState);
  const setIsReplyComment = useSetRecoilState(ThreadState.isReplyCommentState);
  const setShowUserProfile = useSetRecoilState(SideBarState.showUserProfileState);
  const setShowNotificationBox = useSetRecoilState(showNotificationState);
  const onSetThreadInfoState = (
    id = '',
    title = '',

    createThread = false,
    replyThread = false,
    replyComment = false
  ) => {
    if (thread?.tid !== undefined) setThreadId(thread?.tid);
    else setThreadId(id);

    setThreadTitle(title);
    setIsCreateThread(createThread);
    setIsReplyThread(replyThread);
    setIsReplyComment(replyComment);
  };

  //! Sign In Click Handle
  const onSignInClick = () => {
    setShowLoginBox(true);
  };

  //! User Profile Click Handle
  const onUserProfileClick = () => {
    setShowUserProfile(true);
  };
  return (
    <div className='fixed bottom-0 w-full bg-bottom-nav text-4xl '>
      <div className='flex text-primary'>
        {/* This component handle showSidebar */}
        <div className=' hover:bg-gray-900 flex-1 flex justify-center transition duration-300'>
          <button type='button' className='relative ml-1 mt-1 '>
            <AiOutlineMenu onClick={() => setShowSideBar(!showSideBar)} />
          </button>
        </div>
        {/* This component handle Show Notification */}
        <div className=' hover:bg-gray-900 flex-1 flex justify-center transition duration-300'>
          <button
            type='button'
            className='relative ml-1 mt-1'
            onClick={() => {
              if (AuthUser.id) {
                setShowNotificationBox(true);
              } else {
                setShowLoginBox(true);
              }
            }}
          >
            <IoMdNotifications />
            {AuthUser.id && notifications?.length > 0 && (
              <div className='px-1 py-0 bg-red-500 absolute top-2 right-0 text-xs rounded-full'>
                {!isNotifyLoading && <span>{`${notifications.length || 0}`}</span>}
              </div>
            )}
          </button>
        </div>
        {/* This component handle  Create Post */}
        <div className='  flex-1 flex justify-center '>
          <div className='w-14 h-14 rounded-full bg-fourth  mt-0.5 hover:bg-opacity-70 relative -top-6 transition duration-300'>
            <button
              type='button'
              className='relative ml-2.5 mt-2.5 text-4xl'
              onClick={() => {
                if (AuthUser.id) {
                  onSetThreadInfoState('', '', true, false, false);
                  setShowCreatePost(true);
                } else setShowLoginBox(true);
              }}
            >
              <AiOutlinePlus />
            </button>
          </div>
        </div>
        {/* This component handle  Thread Search */}
        <div className=' hover:bg-gray-900 flex-1 flex justify-center transition duration-300'>
          <button type='button' className='relative ml-1 mt-1 '>
            <AiOutlineSearch onClick={() => setShowSearchBar(!showSearchBar)} />
          </button>
        </div>
        {/* This component handle  User Profile */}
        <div className=' hover:bg-gray-900 flex-1 flex justify-center transition duration-300'>
          {AuthUser.id ? (
            <div className='w-8 h-8 rounded-full bg-white  mt-3.5 flex'>
              <button
                type='button'
                className='relative ml-1 mt-1 text-black text-2xl'
                onClick={onUserProfileClick}
              >
                <RiUser3Fill />
              </button>
            </div>
          ) : (
            <button
              type='button'
              className='relative ml-1 mt-1 text-white text-2xl'
              onClick={onSignInClick}
            >
              <FaSignInAlt />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
