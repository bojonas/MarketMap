import React, { useRef, useEffect, useState } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';

export default function LayoutViewer({ layout, zoom, productsInMarket }) {
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

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div ref={ref} className='border-[1svh] border-darkgray-custom overflow-scroll' style={dimensions}>
          <div id='layoutViewer' className='grid w-fit h-fit' 
            style={{ 
              gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
              gridTemplateRows: `repeat(${layout.length}, ${scale}px)`, 
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}>
            {layout.map((row, i) => (
              row.map((cell, j) => (
                <div key={`cell-${i}-${j}`} className='relative'>
                  <CellViewer
                    key={cell['coordinates']} 
                    type={cell['type']} 
                    cellStyle={{ 
                      height: `${scale}px`, 
                      width: `${scale}px`, 
                      border: `${scale/10}px solid #171717`,
                      borderRadius: `${scale/5}px`
                    }}
                  />
                  { productsInMarket.filter(product => product.row === i && product.column === j).map(product => (
                    <div key={product.product_id} className='absolute top-1/2 left-1/2 rounded-full'
                      style={{ 
                        width: `${scale/2}px`, 
                        height: `${scale/2}px`,
                        backgroundColor: 'green',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1
                    }}/>
                  ))}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}