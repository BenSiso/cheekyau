import React from 'react';

export default function Table({ dataSource, columns }) {
  return (
    <table className='table-auto w-full text-white'>
      <thead className='hidden md:table-header-group'>
        <tr className='border-b-2 h-14'>
          <th className='sticky -top-5 bg-left-nav-dark z-50'>No</th>
          {columns?.map((load) => (
            <th className={`sticky -top-5 bg-left-nav-dark z-50 ${load.className}`} key={load.key}>
              {load.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='hidden md:table-header-group'>
        {dataSource?.map((load, index) => (
          <tr className='h-14 text-center border-b-0.5 border-opacity-50' key={load.key}>
            <td>{`${index + 1}`}</td>
            {columns?.map((load1) =>
              load1.render ? (
                <td className={load1.className} key={load1.key}>
                  {load1.render(load)}
                </td>
              ) : (
                <td className={load1.className} key={load1.key}>
                  {load[load1.key]}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
      <tbody className='md:hidden w-full'>
        {dataSource?.map((load) =>
          columns?.map((load1, index1) => {
            if (load1.render && index1 !== columns.length - 1) {
              return (
                <tr className='h-14 text-left' key={load1.key}>
                  <td className={`${load1.className} w-20`}>{load1.title} :</td>
                  <td className={load1.className}>
                    <p className='truncate w-40 lg:w-full'>{load1.render(load)}</p>
                  </td>
                </tr>
              );
            }
            if (load1.render && index1 === columns.length - 1) {
              return (
                <tr className='h-14 text-left border-b-1 border-opacity-50' key={load1.key}>
                  <td className={`${load1.className} w-20`}>{load1.title} :</td>
                  <td className={load1.className}>
                    <p className='truncate w-40 lg:w-full'>{load1.render(load)}</p>
                  </td>
                </tr>
              );
            }
            if (!load1.render && index1 !== columns.length - 1) {
              return (
                <tr className='h-14 text-left' key={load1.key}>
                  <td className={`${load1.className} w-20`}>{load1.title} :</td>
                  <td className={`${load1.className}`}>
                    <p className='truncate w-40 lg:w-full'>{load[load1.key]}</p>
                  </td>
                </tr>
              );
            }
            if (!load1.render && index1 === columns.length - 1) {
              return (
                <tr className='h-14 text-left border-b-1 border-opacity-50' key={load1.key}>
                  <td className={`${load1.className} w-20`}>{load1.title} :</td>
                  <td className={load1.className}>
                    <p className='truncate w-40 lg:w-full'>{load[load1.key]}</p>
                  </td>
                </tr>
              );
            }
            return null;
          })
        )}
      </tbody>
    </table>
  );
}
