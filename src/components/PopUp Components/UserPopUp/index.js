import { Modal, notification, Select } from 'antd';
import axios from 'axios';
import { useAuthUser } from 'next-firebase-auth';
import { useState } from 'react';

const { Option } = Select;
const UserPopUp = ({ user }) => {
  const AuthUser = useAuthUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [duration, setDuration] = useState(3);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleChange = (value) => {
    setDuration(value.value);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await axios.post('/api/user/ban', { id: AuthUser.id, uid: user.uid, duration }).then(() => {
      setConfirmLoading(false);
      notification.success({
        message: 'Success',
        description: 'User has been banned',
        duration: 2,
      });
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const options = [
    {
      value: '3',
      label: '3 day',
    },
    {
      value: '7',
      label: '7 days',
    },
    {
      value: '-1',
      label: 'Forever',
    },
  ];

  return (
    <div className='text-white text-center h-full w-full space-y-4'>
      <div className='py-4'>
        <p className='text-white text-opacity-50'>#{user?.id}</p>
        <p>Username: {user?.nickname}</p>
        <p>Email: {user?.email}</p>
      </div>
      <button className='w-full bg-red-500 py-2' type='button' onClick={showModal}>
        Ban User
      </button>
      <Modal
        key='ban-modal'
        title='Ban User'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
        <div className='flex justify-start items-center space-x-4 '>
          <p className='text-white'>Ban Duration</p>
          <Select
            labelInValue
            defaultValue={{ value: options[0].value, label: options[0].label }}
            style={{ width: 120 }}
            onChange={handleChange}
            dropdownStyle={{
              backgroundColor: '#2d2f3e',
              color: '#fff',
            }}
          >
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default UserPopUp;
