import { useRequest } from 'ahooks';
import { Switch } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useAuthUser, withAuthUser, withAuthUserSSR } from 'next-firebase-auth';
import { useState } from 'react';
import { FaUserAltSlash } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import { Layout, Popup } from '../../../components/Admin';
import { AdminMain } from '../../../layout';
import User from '../../../model/user';
import { searchState } from '../../../recoil/admin/main';
import { withDomain } from '../../../utilities/dev';

const UserPage = () => {
  const AuthUser = useAuthUser();
  // request api
  const onGetUser = async () => {
    const res = await axios(withDomain(`/api/user?id=${AuthUser.id}`));
    return res.data.user;
  };

  const { data: userList, run: onRefetch } = useRequest(onGetUser);

  // Recoil
  const [openSearch, setOpenSearch] = useRecoilState(searchState);

  // State
  const [openModal, setOpenModal] = useState(false);
  const [openModalType, setOpenModalType] = useState('unban'); // ban and unban
  const [user, setUser] = useState({});
  const [banDurationNum, setBanDurationNum] = useState(3);
  const [searchData, setSearchData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [loadingBan, setLoadingBan] = useState(false);

  const onCancel = () => {
    setUser({});
    setBanDurationNum(3);
    setOpenModal(false);
    setOpenSearch(false);
    setSearchData([]);
    setSearchInput('');
  };

  const onToggleBan = async () => {
    setLoadingBan(true);
    // Implement with API
    if (user?.status === 'banned') {
      await axios
        .post(withDomain('/api/user/unban'), { id: AuthUser.id, uid: user.uid })
        .then(() => {
          setLoadingBan(false);
          onCancel();
          onRefetch();
        });
    } else {
      await axios
        .post(withDomain('/api/user/ban'), {
          id: AuthUser.id,
          uid: user.uid,
          duration: banDurationNum, // 3 days default
        })
        .then(() => {
          setLoadingBan(false);
          onCancel();
          onRefetch();
        });
    }
  };

  const handleSearch = ({ target }) => {
    const text = target.value;
    const arr = [...userList];
    let newArr = [];

    if (text !== '') {
      arr
        .filter((title) => title.nickname.toUpperCase().includes(text.toUpperCase()))
        .map((load) => newArr.push(load));
    } else {
      newArr = [];
    }

    setSearchInput(text);
    setSearchData(newArr);
  };

  // table columns
  const columns = [
    {
      title: 'ID',
      key: 'id',
    },
    {
      title: 'Display name',
      key: 'nickname',
      className: 'text-left',
    },
    {
      title: 'Email Address',
      key: 'email',
      className: 'text-left',
    },
    {
      title: 'Register Time',
      key: 'registerTime',
      render: (record) => {
        const { registeredAt } = record;
        const convertRegisterAt = registeredAt ? moment(registeredAt).fromNow() : '';
        return <span>{`${convertRegisterAt.toString()}`}</span>;
      },
    },
    {
      title: 'Last Login',
      key: 'lastLogin',
      render: (record) => {
        const { loginedAt } = record;
        const convertLastLogin = loginedAt ? moment(loginedAt).fromNow() : '';
        return <span>{`${convertLastLogin.toString()}`}</span>;
      },
    },
    {
      title: 'Ban Duration',
      key: 'banDuration',
      render: (record) => {
        const { banDuration } = record;
        const expires = moment(banDuration);
        const dur = moment.duration({ from: moment(), to: expires });
        const convertBanTime = banDuration ? moment(banDuration).fromNow() : '';
        return <span>{`${dur.asDays() > 7 ? 'Forever' : convertBanTime.toString()}`}</span>;
      },
    },
    {
      title: 'User Type',
      key: 'type',
    },
    {
      title: 'Banned',
      key: 'action',
      render: (record) => {
        const { status } = record;
        let banned = false;

        if (status === 'banned') {
          banned = true;
        }

        return (
          <Switch
            checked={banned}
            onClick={() => {
              setOpenModalType(banned ? 'unban' : 'ban');
              setOpenModal(true);
              setUser(record);
            }}
          />
        );
      },
    },
  ];

  return (
    <AdminMain>
      <div className='w-full p-5 bg-left-nav-dark rounded-lg'>
        {/* Search Modal */}
        <Popup.Modal
          open={openSearch}
          setOpen={setOpenSearch}
          title='Search user'
          titleClass='text-left'
          footer={null}
        >
          <div className='w-96'>
            <input
              value={searchInput}
              className='p-2 w-full rounded-lg bg-top-nav-dark text-white font-bold border-2 border-opacity-30'
              onChange={handleSearch}
            />
          </div>
          <div
            className={`border-t-2 border-opacity-30 mt-5 pt-2 w-full overflow-auto${
              searchData.length === 0 ? ' h-full' : ' h-96'
            }`}
          >
            {searchData.length === 0 ? (
              <h1 className='text-lg text-white text-center'>No data</h1>
            ) : (
              searchData.map((record) => {
                return (
                  <button
                    type='button'
                    className='p-2 px-5 text-white hover:bg-black rounded-lg flex items-center justify-between text-lg w-full duration-200'
                    key={record.key}
                    onClick={() => {
                      const { status } = record;
                      let banned = false;

                      if (status === 'banned') {
                        banned = true;
                      }

                      setOpenModalType(banned ? 'unban' : 'ban');
                      setOpenModal(true);
                      setUser(record);
                    }}
                  >
                    <span>{`${record.nickname}`}</span>
                    {record.status === 'banned' && (
                      <span>
                        <FaUserAltSlash />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </Popup.Modal>

        {/* Ban Modal (true) or Unban Modal (false) */}
        {openModalType === 'unban' ? (
          <Popup.Modal
            title='Do you want to unban?'
            open={openModal}
            setOpen={setOpenModal}
            onOk={onToggleBan}
            onCancel={onCancel}
            okLoading={loadingBan}
          />
        ) : (
          <Popup.Modal
            title='How many day?'
            open={openModal}
            setOpen={setOpenModal}
            onOk={onToggleBan}
            onCancel={onCancel}
            okLoading={loadingBan}
            okText='Ban User'
            cancelText='Cancel'
          >
            <div className='mb-5 text-center font-bold text-lg'>
              <select
                className='bg-left-nav-dark text-white border-2 border-opacity-30 px-4 py-1 rounded-lg'
                onChange={(e) => setBanDurationNum(e.target.value)}
              >
                <option key='3' value={3}>
                  3 days
                </option>
                <option key='7' value={7}>
                  7 days
                </option>
                <option key='-1' value={-1}>
                  Forever
                </option>
              </select>
            </div>
          </Popup.Modal>
        )}

        <Layout.Table
          dataSource={userList?.map((data) => ({ ...data, key: data.id }))}
          columns={columns}
        />
      </div>
    </AdminMain>
  );
};

export const getServerSideProps = withAuthUserSSR()(async ({ AuthUser }) => {
  const user = await User.getByUid(AuthUser.id);
  if (user?.type !== 'admin') {
    return {
      redirect: {
        destination: '/category/1',
      },
    };
  }
  return {
    props: {
      status: 'success',
    },
  };
});
export default withAuthUser()(UserPage);
