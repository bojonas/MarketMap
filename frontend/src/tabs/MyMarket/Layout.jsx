import React, { useRef, useEffect, useState } from 'react';
import Cell from './Cell';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import { useContext } from 'react';
import { MyMarketContext } from '../../context/MyMarketContext';
import { MapEditorContext } from '../../context/MapEditorContext';

export default function Layout({ zoom }) {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
  const { width, height } = useAdjustScale(ref);
  const { borderCells } = useContext(MyMarketContext);
  const { setEditZone, layout } = useContext(MapEditorContext);
  const scale = Math.min(width / layout[0].length, height / layout.length);

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
            {layout.map((row, i) => (
              row.map((cell, j) => (
                <div key={cell.y} onClick={() => typeof cell.zone_id === 'number' ? setEditZone(cell.zone_id) : null} className='cursor-pointer'>
                  { cell && <Cell 
                    type={cell.type} 
                    coordinates={`${cell.x}-${cell.y}`}
                    cellStyle={{ 
                      height: `${scale}px`, 
                      width: `${scale}px`, 
                      transform: `rotate(${layout[i][j]['rotation']}deg)`,
                      border: `${scale/10}px solid #171717`,
                      borderRadius: `${scale/5}px`,
                      backgroundColor: borderCells.size && typeof cell.zone_id === 'number' ? `rgba(${borderCells.get(cell.zone_id).zone_color}, ${cell.type === 'empty' ? '0.3' : '0.6'})` : ''
                    }}
                  />}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}