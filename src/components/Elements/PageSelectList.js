const PageSelectList = ({ thread }) => {
  return (
    <>
      <select
        name='pages'
        id='pages'
        className=' bg-transparent focus:opacity-100 text-xs text-gray-800 text-opacity-50 hover:text-opacity-100'
      >
        <option value='p1' defaultValue='p1'>
          {thread?.total_page} p
        </option>
        <option value='p2'>2</option>
        <option value='p3'>3</option>
        <option value='p4'>4</option>
      </select>
    </>
  );
};

export default PageSelectList;
