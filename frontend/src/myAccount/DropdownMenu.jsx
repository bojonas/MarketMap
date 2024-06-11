import React from 'react';

const DropdownMenu = ({ isVisible, children }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-[6.3svh] bg-white shadow-lg rounded-lg p-4 z-10">
      {children}
    </div>
  );
};

export default DropdownMenu;
