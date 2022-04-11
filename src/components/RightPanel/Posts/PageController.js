export default function PageController({ prevUrl, nextUrl }) {
  return (
    <div className='flex justify-between py-4'>
      <div className='text-md  text-yellow-500 py-4 px-4 '>
        <a href={prevUrl} className='hover:bg-gray-700 p-1 rounded-md cursor-pointer'>
          Previous
        </a>
      </div>
      <div className='text-md  text-yellow-500 py-4 px-4'>
        <select name='pages' id='pages' className=' bg-transparent'>
          <option value='page1'>The first page</option>
          <option value='page2'>2 pages</option>
          <option value='page3'>2 pages</option>
          <option value='page4'>2 pages</option>
        </select>
      </div>
      <div className='text-md  text-yellow-500 py-4 px-4'>
        <a href={nextUrl} className='hover:bg-gray-700 p-1 rounded-md cursor-pointer'>
          Next
        </a>
      </div>
    </div>
  );
}
