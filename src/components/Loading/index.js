const index = () => {
  return (
    <div className='flex justify-center items-center h-screen flex-col'>
      <div className='flex space-x-2 text-2xl justify-start '>
        <a href='/' className='w-10 h-10 bg-third p-2 rounded-lg -mt-1 hover:opacity-60'>
          <img className='flex-none animate-bounce' src='/images/logo.png' alt='logo icon' />
        </a>
        <a href='/' className='w-28  '>
          <img className='flex-none' src='/images/cheeky-word.png' alt='logo text' />
        </a>
      </div>

      <div className='text-white text-center text-base animate-pulse'>Getting Started....</div>
    </div>
  );
};
export default index;
