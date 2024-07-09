import React from 'react';

const DropdownMenu = ({ isVisible, children }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-[6.5svh] left-0 w-[12svw] border-black-custom border-4 bg-darkgray-custom shadow-lg rounded-lg px-[8%] py-[10%] z-10">
      {children}
    </div>
  );
};

export default DropdownMenu;
