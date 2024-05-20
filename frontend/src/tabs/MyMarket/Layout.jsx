import React, { useRef, useEffect, useState } from 'react';
import Cell from './Cell';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import { useContext } from 'react';
import { MapEditorContext } from '../../DimensionContext';

export default function Layout({ zoom }) {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
  const { width, height } = useAdjustScale(ref);
  const { layout } = useContext(MapEditorContext);
  const scale = Math.min(width/ layout[0].length, height / layout.length);

  // adjust scrollbars after zoom
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
          <div id='layoutContainer' className='grid w-fit h-fit' 
            style={{ 
              gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
              gridTemplateRows: `repeat(${layout.length}, ${scale}px)`, 
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}>
            {layout.map((row) => (
              row.map((cell) => (
                <Cell 
                  key={cell['coordinates']} 
                  type={cell['type']} 
                  scale={scale} 
                  cellCoordinates={cell['coordinates']}
                /> 
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}