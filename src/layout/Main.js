/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRequest } from 'ahooks';
import { Modal } from 'antd';
import DrawerWrapper from 'antd/lib/drawer';
import axios from 'axios';
import { useAuthUser, withAuthUser } from 'next-firebase-auth';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GiBookCover } from 'react-icons/gi';
import { IoCaretBackSharp, IoCaretForwardOutline } from 'react-icons/io5';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import LoginBox from '../components/Auth/LoginBox';
import BottomNav from '../components/BottomNavBar';
import LeftNav from '../components/LeftNav';
import LeftNavFull from '../components/LeftNavFull';
import LeftHeader from '../components/LeftPanel/Header';
import LeftBody from '../components/LeftPanel/ThreadList';
import MetaTitle from '../components/NextSeo/MetaTitle';
import AddAsApp from '../components/PopUp Components/AddAsApp';
import ConfirmBox from '../components/PopUp Components/ConfirmBox';
import CreatePostBox from '../components/PopUp Components/CreatePost';
import HistoryConfirmBox from '../components/PopUp Components/HistoryConfirmBox';
import NotificationsBox from '../components/PopUp Components/Notifications';
import SearchBar from '../components/PopUp Components/SearchBar';
import ShareBox from '../components/PopUp Components/ShareBox';
import UserProfile from '../components/PopUp Components/UserProfile';
import RightHeader from '../components/RightPanel/Header';
import RightBody from '../components/RightPanel/Posts';
import WelcomePage from '../components/RightPanel/WelcomePage';
import TopNav from '../components/TopNavBar';
import { WindowSize } from '../constants';
import {
  isLoginState,
  isMobileSizeState,
  isModalVisibleState,
  pageNumState,
  routeState,
  showAddAsAppBannerState,
  showConfirmBoxState,
  showCreatePostState,
  showHistoryConfirmBoxState,
  showLoginBoxState,
  showNotificationState,
  showSearchBarState,
  showSideBarState,
  showUserProfileState,
  uidState,
  userInfoState,
} from '../recoil';
import { showShareBoxState } from '../recoil/sharebox/atom';
import * as ThreadState from '../recoil/thread';
import { isBrowser } from '../utilities/dom';
import { useWindowSize } from '../utilities/hooks';

const UserPopUp = dynamic(() => import('../components/PopUp Components/UserPopUp'), { ssr: false });

const Main = ({ thread, threads, comments, category }) => {
  const setIsMobileSize = useSetRecoilState(isMobileSizeState);
  // Window Size Hook
  const [x, y] = useWindowSize();

  // Screen Size Detect
  useEffect(() => {
    if (x <= WindowSize.tablet.width) {
      setIsMobileSize(true);
    } else {
      setIsMobileSize(false);
    }
  }, [x, y]);

  // Config Dynamic Component
  const router = useRouter();
  const AuthUser = useAuthUser();
  const pathName = router.pathname;

  /*                              _____________________________
                                        Recoil Atom State
                                        _________________
  */

  // UserInfo State
  const userInfo = useRecoilValue(userInfoState);
  // isModalVisible State
  const [isModalVisible, setIsModalVisible] = useRecoilState(isModalVisibleState);

  // SideBar State
  const [showSideBar, setShowBar] = useRecoilState(showSideBarState);
  const [showSearchBar, setShowSearchBar] = useRecoilState(showSearchBarState);
  const showUserProfile = useRecoilValue(showUserProfileState);

  // Banner State
  const [showAddAsAppBanner, setShowAddAsAppBanner] = useRecoilState(showAddAsAppBannerState);

  // Auth State
  const [showLoginBox, setShowLoginBox] = useRecoilState(showLoginBoxState);
  const setIsLogin = useSetRecoilState(isLoginState);
  const setUid = useSetRecoilState(uidState);
  // Notification State
  const [showNotificationBox, setShowNotificationBox] = useRecoilState(showNotificationState);

  // ShareBox
  const [showShareBox, setShowShareBox] = useRecoilState(showShareBoxState);

  // Confirm Box
  const [showConfirmBox, setShowConfirmBox] = useRecoilState(showConfirmBoxState);
  const [showHistoryConfirmBox, setShowHistoryConfirmBox] = useRecoilState(
    showHistoryConfirmBoxState
  );

  // Page Number
  const pageNum = useRecoilValue(pageNumState);

  // CreatePost State
  const [showCreatePost, setShowCreatePost] = useRecoilState(showCreatePostState);
  const setThreadTitle = useSetRecoilState(ThreadState.threadTitleState);
  const setThreadId = useSetRecoilState(ThreadState.threadIdState);
  const setIsCreateThread = useSetRecoilState(ThreadState.isCreateThreadState);
  const setIsReplyThread = useSetRecoilState(ThreadState.isReplyThreadState);
  const setIsReplyComment = useSetRecoilState(ThreadState.isReplyCommentState);
  const isContentEmpty = useRecoilValue(ThreadState.isContentEmptyState);
  const setReplyFromContentText = useSetRecoilState(ThreadState.replyFromContentTextState);

  // Route State
  const [{ isThreadPath }, setRoutes] = useRecoilState(routeState);

  // ! Add as app logic
  const bnObj = { value: true, timestamp: new Date().getTime(), isCreated: true };
  const getBannerCheck = isBrowser && localStorage?.getItem('bannerConfig');
  useEffect(() => {
    const banner = JSON.parse(getBannerCheck) || false;
    if (!banner && banner.isCreated !== true) {
      localStorage.setItem('bannerConfig', JSON.stringify(bnObj));
    } else if (banner && banner.timestamp && banner.isCreated) {
      const timeNow = new Date().getTime();
      const is24h = (timeNow - banner.timestamp) / (1000 * 60 * 60) > 24; // Bigger than 24h
      if (is24h) {
        localStorage.setItem('bannerConfig', JSON.stringify(bnObj));
      }
    }
  }, []);

  // Route State Update
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const lastPath = history[history.length - 1] || '';
    if (history[history.length - 1] !== pathName) setHistory([...history, pathName]);

    setRoutes({
      isHomePath: pathName === '/',
      isAllPath: pathName === '/all',
      isRegisterPath: pathName === '/register',
      isPopularPath: pathName.includes('popular'),
      isHistoryPath: pathName.includes('history'),
      isBookmarkPath: pathName.includes('bookmark'),
      isSearchPath: pathName.includes('search'),
      isPagePath: pathName.includes('page'),
      isThreadPath: pathName.includes('/thread/'),
      isCategoryPath: pathName.includes('/category/'),
      lastPath,
    });

    // Update Every Change route and login/logout
    if (AuthUser.id) {
      setUid(AuthUser.id);
      setIsLogin(true);
    } else {
      setUid('');
      setIsLogin(false);
    }
  }, [router, AuthUser]);

  useEffect(() => {
    const getBanner = localStorage.getItem('bannerConfig');
    const banner = (isBrowser && JSON.parse(getBanner)) || false;
    if (banner && banner.value) {
      setShowAddAsAppBanner(true);
    }
  }, [router]);

  const setThreadInfoState = (
    id,
    title,
    createThread = false,
    replyThread = false,
    replyComment = false
  ) => {
    setThreadId(id);
    setThreadTitle(title);
    setIsCreateThread(createThread);
    setIsReplyThread(replyThread);
    setIsReplyComment(replyComment);
    setReplyFromContentText('');
  };

  // Other Functions

  const handleHideComponents = () => {
    // Handle When There is a text in CreatePost then ask the user
    if (isContentEmpty) {
      setShowCreatePost(false);
    } else {
      setShowConfirmBox(true);
    }
    setShowShareBox(false);
    setShowBar(false);
    setShowLoginBox(false);
    setShowHistoryConfirmBox(false);
    setShowSearchBar(false);
    setShowNotificationBox(false);
  };

  // Modal Functions
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const getCategories = async () => {
    const res = await axios.get('/api/category').then((r) => r.data.payload.categories);
    return res;
  };

  const { data: categories } = useRequest(getCategories, { getCache: true });
  return (
    <>
      {/* Modal Pop Up User Info */}
      <Modal
        key={userInfo}
        title={userInfo?.nickname}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{ backgroundColor: '#2d2f3e' }}
      >
        <UserPopUp user={userInfo} />
      </Modal>
      {/* Handle User Authentication */}

      {/* // Screen Size Max Width 1024 */}

      {/* Side bar */}

      {/* NextSeo */}
      <MetaTitle thread={thread} category={category} />

      {/* Mobile Size */}
      {window.innerWidth < WindowSize.tablet.width ? (
        <div className='min-w-280 w-full max-w-4xl h-inherit bg-left-panel-body-dark'>
          {/* User Profile Pop up Component */}
          {showUserProfile && <UserProfile />}
          {/* Left Panel Top Menu */}
          {!isThreadPath ? (
            <div className='h-full flex-none flex-shrink-0 flex-grow-0 relative overflow-hidden'>
              <LeftHeader category={category} thread={thread} />
              <LeftBody threadsProp={threads} category={category} />
              {showSearchBar && (
                <div className='fixed left-0 top-1/4 right-0 z-20'>
                  <SearchBar />
                </div>
              )}

              <DrawerWrapper
                closable
                headerStyle={{ display: 'none' }}
                placement='left'
                visible={showSideBar}
                getContainer={false}
                onClose={() => {
                  setShowBar(false);
                }}
                bodyStyle={{ backgroundColor: '#22242C', padding: 0 }}
                style={{ position: 'absolute' }}
                contentWrapperStyle={{ width: '250px' }}
              >
                <LeftNavFull categories={categories} />
              </DrawerWrapper>
              <BottomNav thread={thread} />
            </div>
          ) : (
            /*
            =========================================================
              For Thread Page or Right Panel for mobile version
             _______________________________________________________
            */
            <div className=' bg-right-panel-body-dark relative flex flex-col h-full'>
              {/* Right Panel Top Menu */}
              <RightHeader thread={thread} />

              {/* Right Body Panel */}
              <div className='flex-1 overflow-hidden'>
                <RightBody thread={thread} commentsProp={comments} />
              </div>
              {showAddAsAppBanner && (
                <div className='fixed flex justify-center w-full h-screen  top-3/4 z-50'>
                  <AddAsApp />
                </div>
              )}
              {/* Bottom Reply Thread Bar  */}
              {isThreadPath && (
                <div className='w-full shadow-sm text-lg mt-4'>
                  <div className='flex justify-between bg-bottom-black-bar py-2 px-4'>
                    <div className='flex justify-center ml-14  w-full rounded-full py-1.5 px-6 text-secondary text-center'>
                      <p className='bg-third w-7 rounded-full'>{pageNum}</p>
                    </div>
                    <button type='button' className='pr-10 cursor-pointer'>
                      <GiBookCover
                        className=' text-secondary hover:text-fifth '
                        size={20}
                        color='gray'
                      />
                      <p className='text-gray-600 text-xs'>5/3</p>
                    </button>
                    <div
                      className='py-1.5 px-9 bg-reply-btn text-primary rounded-3xl cursor-pointer hover:opacity-70'
                      onClick={() => {
                        setThreadInfoState(thread?.id, thread?.title, true, false, false);
                        if (AuthUser.id) setShowCreatePost(true);
                        else setShowLoginBox(true);
                      }}
                    >
                      Post
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {showCreatePost && <CreatePostBox categories={categories} category={category} />}
          {(showCreatePost ||
            showShareBox ||
            showLoginBox ||
            showConfirmBox ||
            showHistoryConfirmBox ||
            showNotificationBox ||
            showSearchBar) && (
            <div
              className='fixed max-w-screen-2xl h-screen top-0 bottom-0 left-0 right-0 m-auto z-10 bg-black bg-opacity-50'
              onClick={() => {
                handleHideComponents();
              }}
            />
          )}
          {/* ShareBox Component */}
          {showShareBox && <ShareBox />}
          {showLoginBox && <LoginBox />}
          {showConfirmBox && <ConfirmBox />}
          {showHistoryConfirmBox && <HistoryConfirmBox />}
          {showNotificationBox && <NotificationsBox />}
        </div>
      ) : (
        /*
            =========================================================
                             Desktop and Tablet Size
             _______________________________________________________
            */
        <div className='max-w-screen-2xl h-screen m-auto  overflow-hidden flex flex-col'>
          {/* Top NavBar */}

          <TopNav thread={thread} />

          <div
            id='drawer-container'
            className='flex justify-between flex-shrink-0 overflow-hidden flex-1 relative'
          >
            {/* Left Nav */}
            {/* Menu Bar */}

            <DrawerWrapper
              closable={false}
              headerStyle={{ display: 'none' }}
              placement='left'
              visible={showSideBar}
              onClose={() => {
                setShowBar(false);
              }}
              getContainer={() => document.getElementById('drawer-container')}
              bodyStyle={{ backgroundColor: '#22242C', padding: 0 }}
              style={{ position: 'absolute' }}
            >
              <LeftNavFull categories={categories} />
            </DrawerWrapper>
            <div className='w-28 flex-none flex-shrink-0 flex-grow-0 bg-left-nav-dark overflow-y-auto pb-2'>
              <LeftNav categories={categories} />
            </div>
            {/* <div
            className={classNames(
              ' max-w-xs min-w-150 flex-none flex-shrink-0 flex-grow-0 bg-left-nav-dark bg-opacity-80',
              showFullLeftNav ? 'w-2/6' : 'w-24'
            )}
          >
            <LeftNav categories={categories} />
          </div> */}
            <div className='min-w-400 w-4/12 max-w-xl h-full flex-none flex-shrink-0 flex-grow-0 relative'>
              {/* Left Panel Top Menu */}
              <LeftHeader category={category} thread={thread} />
              {/* Left Body Panel */}
              <LeftBody threadsProp={threads} category={category} />
            </div>
            <div className='w-8/12 min-w-300 bg-right-panel-body-dark max-w-5xl relative flex flex-col'>
              {/* Right Panel Top Menu */}
              <RightHeader thread={thread} />

              {/* Right Body Panel */}
              <div className='flex-1 overflow-hidden'>
                {!isThreadPath && <WelcomePage />}
                {isThreadPath && <RightBody thread={thread} commentsProp={comments} />}
              </div>

              {/* Bottom Reply Thread Bar  */}
              {isThreadPath && (
                <div className='relative'>
                  <div className='w-full shadow-sm text-lg'>
                    <div className='flex justify-between bg-bottom-black-bar py-2 px-4'>
                      <div className='flex justify-center items-center ml-14  w-full rounded-full py-1.5 space-x-4 px-6 text-secondary text-center'>
                        <button
                          type='button'
                          className='duration-300 hover:opacity-30 group-hover:text-red-400'
                        >
                          <IoCaretBackSharp />
                        </button>
                        <p className='bg-third w-7 rounded-full'>{pageNum}</p>
                        <button type='button' className='duration-300 hover:opacity-30'>
                          <IoCaretForwardOutline />
                        </button>
                      </div>
                      <div
                        className='py-1.5 px-9 bg-reply-btn text-primary rounded-3xl cursor-pointer hover:opacity-70'
                        onClick={() => {
                          setThreadInfoState(thread?.id, thread?.title, false, true, false);
                          if (AuthUser.id) setShowCreatePost(true);
                          else setShowLoginBox(true);
                        }}
                      >
                        Post
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* CreatePostBox Component */}
          {showCreatePost && <CreatePostBox categories={categories} category={category} />}
          {(showCreatePost ||
            showShareBox ||
            showLoginBox ||
            showConfirmBox ||
            showNotificationBox ||
            showHistoryConfirmBox) && (
            <div
              className='fixed max-w-screen-2xl h-screen top-0 bottom-0 left-0 right-0 m-auto z-10 bg-black bg-opacity-50'
              onClick={() => {
                handleHideComponents();
              }}
            />
          )}
          {/* ShareBox Component */}
          {showShareBox && <ShareBox />}
          {showLoginBox && <LoginBox />}
          {showConfirmBox && <ConfirmBox />}
          {showHistoryConfirmBox && <HistoryConfirmBox />}
          {showNotificationBox && <NotificationsBox />}
        </div>
      )}
    </>
  );
};

export default withAuthUser()(Main);
