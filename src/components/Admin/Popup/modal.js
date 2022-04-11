import { Spin } from 'antd';
import React from 'react';

const Btn = ({ title, onClick, loading }) => {
  return (
    <button
      type='button'
      className={`py-2 px-10 rounded-xl text-white font-bold hover:bg-opacity-50 border-2 border-gray-600 duration-300 relative ${
        loading !== null && loading ? 'bg-black' : 'bg-top-nav-dark'
      }`}
      onClick={onClick}
      disabled={loading}
    >
      {loading !== null && loading && <Spin className='absolute top-2 left-3' />}
      <span>{`${title}`}</span>
    </button>
  );
};

export default function Modal({
  title = 'Are you sure?',
  children,
  open = false,
  setOpen,
  onOk = false,
  onCancel = false,
  cancelText = 'No',
  okText = 'Yes',
  titleClass = 'text-center',
  okLoading = null,
  cancelLoading = null,
  footer,
}) {
  const onCloseModal = () => {
    return setOpen(false);
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full z-50 ${open ? 'block ' : 'hidden '}`}>
      <div className='w-full h-full relative flex justify-center pt-24'>
        <button
          type='button'
          onClick={() => onCloseModal()}
          className='w-full h-full absolute top-0 bg-black bg-opacity-50'
          aria-label='disable'
        />
        <div className='absolute bg-right-panel-body-dark rounded-xl shadow-lg p-5'>
          <div className={titleClass}>
            <h1 className='text-white text-2xl pb-5'>{`${title}`}</h1>
          </div>
          {children && <div>{children}</div>}

          {footer || footer === null ? (
            footer
          ) : (
            <div className='flex justify-center border-t-2 pt-5 border-black border-opacity-25'>
              <div className='space-x-5'>
                <Btn
                  title={cancelText}
                  onClick={() => (onCancel ? onCancel() : onCloseModal())}
                  loading={cancelLoading}
                />
                <Btn
                  title={okText}
                  onClick={() => (onOk ? onOk() : onCloseModal())}
                  loading={okLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
