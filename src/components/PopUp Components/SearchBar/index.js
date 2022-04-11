import dashify from 'dashify';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSetRecoilState } from 'recoil';
import * as SideBarState from '../../../recoil/sidebar';

const index = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const setShowSearchBar = useSetRecoilState(SideBarState.showSearchBarState);

  // Function handle change text
  const updateSearchText = (e) => {
    setSearchText(dashify(e.target.value));
  };
  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      setShowSearchBar(false);
      router.push(`/search?q=${searchText}`);
    }
  };
  const onSearchClick = () => {
    router.push(`/search?q=${searchText}`);
    setShowSearchBar(false);
  };

  return (
    <motion.div
      className='text-2xl flex-grow flex justify-center max-w-3xl text-white w-full'
      animate={{ y: ['100%', '0%'] }}
      transition={{ duration: 0.5 }}
      initial={{ y: '100%' }}
    >
      {/* Input Search Bar */}
      <input
        className='bg-search-bar xl:w-11/12  md:w-3/4 sm:w-3/4 w-11/12 h-12 rounded-md px-4 pl-4 pr-10 text-2xl'
        type='text'
        onChange={updateSearchText}
        onKeyPress={handleEnterKey}
      />
      <AiOutlineSearch
        className='-ml-8 mt-2.5 cursor-pointer hover:opacity-70'
        onClick={onSearchClick}
      />
    </motion.div>
  );
};

export default index;
