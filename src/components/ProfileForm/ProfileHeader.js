import React from 'react';
import { ImCross } from 'react-icons/im';
import { useSetRecoilState } from 'recoil';
import { showProfileBoxState } from '../../recoil/sidebar';

export default function ProfileHeader() {
  const setShowProfileBox = useSetRecoilState(showProfileBoxState);
  return (
    <div className='flex justify-between items-center bg-setting-header px-2 py-3 w-full md:h-16 border-b-2 md:border-b-0'>
      <p className='left-0 ml-4 mt-1'>更改帳號資料</p>
      <div>
        <ImCross
          onClick={() => setShowProfileBox(false)}
          aria-hidden='true'
          className=' right-0 m-1'
          size={12}
        />
      </div>
    </div>
  );
}
