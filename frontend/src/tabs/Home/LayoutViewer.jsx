import React, { useRef, useEffect, useState } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';

export default function LayoutViewer({ layout, zoom }) {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
  const { width, height } = useAdjustScale(ref);
  const scale = Math.min(width/ layout[0].length, height / layout.length);

  // fix scrollbars after zoom
  useEffect(() => {
    if (ref.current) {
      const container = ref.current;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    }
  }, [zoom]);

  // update dimensions after initial render
  useEffect(() => {
    setDimensions({ width: 'fit-content', height: 'fit-content' });
  }, []);

  //const { emptyRows, emptyColumns } = getCellStyles(layout, scale);
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div ref={ref} className='bg-black-custom border-[1svh] border-black-custom overflow-scroll' style={dimensions}>
          <div id='layoutViewer' className='grid w-fit h-fit' 
            style={{ 
              gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
              gridTemplateRows: `repeat(${layout.length}, ${scale}px)`, 
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}>
            {layout.map((row, i) => (
              row.map((cell, j) => (
                <CellViewer
                  key={cell['coordinates']} 
                  type={cell['type']} 
                  cellStyle={{ 
                    height: `${scale}px`, 
                    width: `${scale}px`, 
                    border: `${scale/10}px solid rgb(16 16 16)`,
                    borderRadius: `${scale/5}px`
                  }}
                /> 
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
function getCellStyles(layout, scale) {
  // Check for empty rows
  const emptyRows = layout.map(row => row.every(cell => cell.type === 'empty'));

  // Find the maximum column length
  const maxColLength = Math.max(...layout.map(row => row.length));

  // Check for empty columns
  const emptyColumns = Array(maxColLength).fill().map((_, colIndex) => layout.every(row => row[colIndex] && row[colIndex].type === 'empty'));

  return { emptyRows, emptyColumns };
}*/
