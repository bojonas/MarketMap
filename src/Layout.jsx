import React from 'react';

// a object in the cell has a custom size: the size determines how many objects can be in the cell
// the size ranges from 12 to 1. this means if the object is size 12 only one object fits in the cell. if the object is size 6, 2 of these fit in one cell
const Cell = ({ type }) => {
  let cellStyle = "h-[1rem] flex items-center justify-center";
  if (type === "aisle") {
    cellStyle += " bg-green-200";
  } else if (type === "checkout") {
    cellStyle += " bg-blue-200";
  } else if (type === "empty") {
    cellStyle += " bg-slate-700";
  }

  return <div className={ cellStyle }></div>;
};

function Layout({ data }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {data.map((row, i) => (
        <div key={i} className="border-2 border-white">
          {row.map((cell, j) => (
            <Cell key={j} type={cell.type}/>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Layout;