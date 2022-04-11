import React from 'react';

const Btn = ({ title, onClick }) => {
  return (
    <button
      type='button'
      className=' bg-top-nav-dark py-2 px-10 rounded-xl text-white font-bold hover:bg-opacity-50 border-2 border-gray-600 duration-300'
      onClick={onClick}
    >
      {`${title}`}
    </button>
  );
};

export default function Confirm({
  title = 'Are you sure?',
  open = false,
  setOpen,
  onOk = false,
  onCancel = false,
  cancelText = 'No',
  okText = 'Yes',
}) {
  const onCloseModal = () => {
    return setOpen(false);
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full z-50 ${open ? 'block ' : 'hidden '}`}>
      <div className='w-full h-full relative flex justify-center pt-24'>
        <div className='w-full h-full absolute top-0 bg-black bg-opacity-50' />
        <div className='absolute bg-right-panel-body-dark rounded-xl shadow-lg p-5 text-center'>
          <h1 className='text-white text-2xl pb-5'>{`${title}`}</h1>
          {/* <p className='text-white text-lg pb-5'>ID: 121</p> */}

          <div className='flex justify-between space-x-5'>
            <Btn title={cancelText} onClick={() => (onCancel ? onCancel() : onCloseModal())} />
            <Btn title={okText} onClick={() => (onOk ? onOk() : onCloseModal())} />
          </div>
        </div>
      </div>
    </div>
  );
}
