import React from 'react';

const defaultMenu = (props) => {
  return (
    <div className='absolute z-0 w-full h-full pt-20'>
      <div className='absolute overflow-auto h-full w-full bg-top-nav-dark pt-1 lg:pt-10'>
        <ul className='space-y-1 lg:pl-5'>{props.children}</ul>
      </div>
    </div>
  );
};

export default function Menu({ type, children }) {
  const props = {
    type,
    children,
  };

  switch (type) {
    default:
      return defaultMenu(props);
  }
}
