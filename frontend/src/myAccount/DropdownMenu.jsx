import React from 'react';

const DropdownMenu = ({ isVisible, children }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-20 right-13 left-0 bg-white shadow-lg rounded-lg p-4 z-10">
      {children}
    </div>
  );
};

export default DropdownMenu;
