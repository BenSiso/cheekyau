import { withAuthUser } from 'next-firebase-auth';
import NextLink from 'next/link';
import { BiBell, BiSearch, BiUser } from 'react-icons/bi';
import { useSetRecoilState } from 'recoil';
import { Layout } from '../components/Admin';
import MetaTitle from '../components/NextSeo/MetaTitle';
import { searchState } from '../recoil/admin/main';

const { Menu, SubMenu } = Layout;

const AdminMain = ({ children }) => {
  // Recoil
  const setSearch = useSetRecoilState(searchState);

  return (
    <div className='max-w-screen-2xl h-screen m-auto overflow-hidden flex flex-col '>
      <MetaTitle />
      <div className='w-full h-full bg-gray-50 grid grid-cols-5 md:grid-cols-4'>
        {/* Side Bar */}
        <div className='col-span-1 h-full bg-top-nav-dark relative'>
          {/* Logo side */}
          <div className='absolute z-40 top-0 w-full lg:pl-10'>
            <NextLink href='/admin'>
              <a>
                <div className='flex items-center justify-center lg:justify-start h-20 w-full'>
                  <div className='w-10 h-10 bg-third p-2 rounded-full'>
                    <img src='/images/logo.png' alt='logo' className='h-full' />
                  </div>
                  <div className='h-10 ml-2 hidden lg:flex'>
                    <img src='/images/cheeky-word.png' alt='cheeky word' className='h-full' />
                  </div>
                </div>
              </a>
            </NextLink>
          </div>
          {/* List link */}
          <Menu>
            <SubMenu icon='dashboard' linkTo='/category/1'>
              Dashboard
            </SubMenu>
            <SubMenu icon='banners' linkTo='/admin/banner'>
              Banners
            </SubMenu>
            <SubMenu icon='users' linkTo='/admin/user'>
              Users
            </SubMenu>
          </Menu>
        </div>

        <div className='col-span-4 md:col-span-3 h-full bg-right-panel-body-dark relative'>
          {/* Top side */}
          <div className='absolute top-0 h-20 w-full bg-left-nav-dark lg:py-5 lg:px-8 p-5 flex justify-between'>
            <div className='relative h-full flex items-center'>
              {/* <BiSearch className='absolute left-3 top-2 text-2xl text-gray-500 hidden lg:block' /> */}
              {/* <input
                className='h-full rounded-full pl-10 hidden lg:block'
              /> */}
              <button
                type='button'
                aria-label='search'
                className='text-3xl text-white hover:bg-gray-300 hover:text-sixth rounded-full p-2 duration-200'
                onClick={() => setSearch(true)}
              >
                <BiSearch />
              </button>
            </div>
            <div className='text-white text-3xl h-full flex justify-center items-center space-x-4'>
              <a href='/' className='relative hover:bg-gray-300 rounded-full p-2 duration-200'>
                <BiBell className=' hover:text-sixth ' />
                <div className='absolute -top-1 -right-0 py-1 px-2 bg-top-nav-dark rounded-full'>
                  <p className='text-sm'>1</p>
                </div>
              </a>
              <a
                href='/'
                className='hover:bg-gray-300 hover:text-sixth rounded-full p-2 duration-200'
                aria-label='user'
              >
                <BiUser />
              </a>
            </div>
          </div>
          {/* Right bottom side */}
          <div className='h-full w-full pt-20'>
            <div className='h-full w-full relative'>
              <div className='h-full w-full p-5 overflow-auto absolute'>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withAuthUser()(AdminMain);
