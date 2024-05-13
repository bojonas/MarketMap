import React, { useRef, useLayoutEffect, useState } from 'react';
import Cell from './Cell';
import { useAdjustScale } from '../../helper/useAdjustScale';

export default function Layout({ layout, setLayout, setScale, zoom }) {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '70svw', height: '75svh' });
  const { width, height } = useAdjustScale(ref);
  const scale = Math.min(width/ layout[0].length, height / layout.length);

  useLayoutEffect(() => {
      setScale(scale);
  }, [scale, setScale]);
  
  // fix scrollbars after zoom
  useLayoutEffect(() => {
    if (ref.current) {
      const container = ref.current;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    }
  }, [zoom]);


  // update dimensions after initial render
  useLayoutEffect(() => {
    setDimensions({ width: 'fit-content', height: 'fit-content' });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div ref={ref} className={`bg-black-custom border-[1svh] border-black-custom overflow-scroll`} style={dimensions}>
          <div id='layoutContainer' className='grid w-fit h-fit' 
            style={{ 
              gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
              gridTemplateRows: `repeat(${layout.length}, ${scale}px)`, 
              transform: `scale(${zoom})`,
              transformOrigin: 'center center'
            }}>
            {layout.map((row) => (
              row.map((cell) => (
                <Cell 
                  key={cell['coordinates']} 
                  type={cell['type']} 
                  scale={scale} 
                  zoom={zoom}
                  layout={layout} 
                  cellCoordinates={cell['coordinates']}
                  setLayout={setLayout}
                /> 
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}