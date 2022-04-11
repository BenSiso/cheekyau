import { AiOutlineTwitter } from 'react-icons/ai';
import { IoLogoInstagram } from 'react-icons/io5';

export default function ProfileFooter() {
  // const [currentYear, setCurrentYear]
  // useEffect(() => {

  // })
  return (
    <div className=' w-full flex flex-col items-center justify-center h-32 text-profile-footer-font text-bold bg-profile-input md:bg-profile-box'>
      <div className='flex-1 flex flex-row mt-10'>
        <IoLogoInstagram className='mx-2' size={18} />
        <AiOutlineTwitter className='mx-2' size={18} />
      </div>
      <div
        className='flex-1 flex  flex-row w-96  item-center justify-center '
        style={{ fontSize: '11px' }}
      >
        <button className='w-18 mr-2 tracking-wider ' type='button'>
          Terms of Use and Disclaimer
        </button>
        <div
          style={{
            borderWidth: '1px',
          }}
          className='bg-gray-900 h-3 my-4 rounded'
        />
        <button className='w-auto m-2 tracking-wider' type='button'>
          Privacy Policy
        </button>
        <div
          style={{
            borderWidth: '1px',
          }}
          className='bg-gray-900 h-3 my-4 rounded'
        />
        <button className=' w-auto m-2  tracking-wider' type='button'>
          Advertisement query
        </button>
      </div>
      <div className='flex-1 text-sm mb-4'>
        Copyright © {new Date().getFullYear()} CHEEKY, All Rights Reserved.
      </div>
    </div>
  );
}
