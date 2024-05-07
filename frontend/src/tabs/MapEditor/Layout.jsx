import React, { useContext } from 'react';
import Cell from './Cell';
import { DimensionContext } from '../../DimensionContext';
import { addRow, addColumn, removeRow, removeColumn } from '../../helper/editLayout'

export default function Layout({ layout, setLayout }) {
  const { height, width } = useContext(DimensionContext);
  const scale = Math.min(
    width*0.8 / layout[0].length, 
    height*0.8 / layout.length
  );

  const layoutCopy = JSON.parse(JSON.stringify(layout));
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-9">
        <button className="add_remove_button mr-2" onClick={() => setLayout(addRow(layoutCopy, 'top'))}>+</button>
        <button className='add_remove_button' onClick={() => setLayout(removeRow(layoutCopy, 'top'))}>-</button>
      </div>
      <div className="flex items-center">
        <div className="flex flex-col mr-2 gap-9">
          <button className='add_remove_button' onClick={() => setLayout(addColumn(layoutCopy, 'left'))}>+</button>
          <button className='add_remove_button' onClick={() => setLayout(removeColumn(layoutCopy, 'left'))}>-</button>
        </div>
        <div className='grid justify-center content-center w-[70svw] max-w-[70svw] h-[70svh] max-h-[70svh] overflow-scroll bg-slate-800 ' 
        style={{ gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, gridTemplateRows: `repeat(${layout.length}, ${scale}px)` }}>
          {layout.map((row) => (
            row.map((cell) => (
              <Cell 
                key={cell['coordinates']} 
                type={cell['type']} 
                scale={scale} 
                layout={layout} 
                cellCoordinates={cell['coordinates']}
                setLayout={setLayout}
              /> 
            ))
          ))}
        </div>
        <div className="flex flex-col ml-2 gap-9">
          <button className='add_remove_button' onClick={() => setLayout(addColumn(layoutCopy, 'right'))}>+</button>
          <button className='add_remove_button' onClick={() => setLayout(removeColumn(layoutCopy, 'right'))}>-</button>
        </div>
      </div>
      <div className="flex gap-9">
        <button className="add_remove_button mr-2" onClick={() => setLayout(addRow(layoutCopy, 'bottom'))}>+</button>
        <button className='add_remove_button' onClick={() => setLayout(removeRow(layoutCopy, 'bottom'))}>-</button>
      </div>
    </div>
  );
}
