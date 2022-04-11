import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { BiHomeAlt, BiCard } from 'react-icons/bi';
import { FaUserFriends } from 'react-icons/fa';

const GetIcon = ({ icon }) => {
  switch (icon) {
    case 'dashboard':
      return <BiHomeAlt className='text-2xl lg:text-3xl' />;
    case 'users':
      return <FaUserFriends className='text-2xl lg:text-3xl' />;
    case 'banners':
      return <BiCard className='text-2xl lg:text-3xl' />;
    default:
      return '';
  }
};

const defaultSubMenu = (props) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <li>
      <NextLink href={props.linkTo}>
        <a
          className={`flex items-center justify-center lg:justify-start text-white p-5 lg:mr-5 md:rounded-xl duration-300 hover:bg-gray-800 ${
            pathname === props?.linkTo && 'bg-gray-800'
          }`}
        >
          <GetIcon icon={props?.icon} />
          <p className='text-2xl ml-5 hidden lg:flex'>{props?.children}</p>
        </a>
      </NextLink>
    </li>
  );
};

export default function SubMenu({ type, children, linkTo, icon }) {
  const props = {
    type,
    children,
    linkTo,
    icon,
  };

  switch (type) {
    default:
      return defaultSubMenu(props);
  }
}
