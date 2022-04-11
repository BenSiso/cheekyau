import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { routeState, showConfirmBoxState } from '../../../recoil';
import { selectedCatIdState } from '../../../recoil/thread';

const CategorySelectionList = ({ categories, category }) => {
  console.log(category);
  // Route State
  const { isCategoryPath, isThreadPath } = useRecoilValue(routeState);

  // Selection State
  const [selectedCatId, setSelectedCatId] = useRecoilState(selectedCatIdState);

  // Show Confirm Box State
  const showConfirmBox = useRecoilValue(showConfirmBoxState);
  // Update Path
  useEffect(() => {
    if (isThreadPath || isCategoryPath) setSelectedCatId(category?.id);
    else setSelectedCatId('1');
  }, [category]);
  return (
    <div>
      <select
        disabled={showConfirmBox}
        onChange={(e) => {
          setSelectedCatId(e.target.value);
        }}
        defaultValue={category?.id || selectedCatId}
        name='pages'
        id='pages'
        className=' w-full bg-gray-900 rounded-md p-3 focus:opacity-100 text-xs text-white text-opacity-50 hover:text-opacity-100'
      >
        {categories.map((cat) =>
          category?.id === cat?.id ? (
            <option value={`${cat?.cid}`} key={cat?.cid} className='text-white'>
              {cat?.name}
            </option>
          ) : (
            <option value={`${cat?.cid}`} key={cat?.cid} className='text-white'>
              {cat?.name}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default CategorySelectionList;
