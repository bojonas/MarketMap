import React, { useRef, useEffect, useState } from 'react';
import Cell from './Cell';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import { useContext } from 'react';
import { MyMarketContext } from '../../context/MyMarketContext';
import { getBorderStyle } from './getBorderStyle';
import { getNonBorderStyle } from './getNonBorderStyle';
import { MapEditorContext } from '../../context/MapEditorContext';

export default function Layout({ zoom }) {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
  const { width, height } = useAdjustScale(ref);
  const { mapLayout, borderCells } = useContext(MyMarketContext);
  const { setEditZone } = useContext(MapEditorContext);
  const layout = mapLayout.map_layout;
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
              row.map((cell, j) => {
                let borderStyle = getNonBorderStyle(scale);
                if (borderCells.size && typeof cell.zone_id === 'number') borderStyle = getBorderStyle(borderStyle, borderCells.get(cell.zone_id), i, j, scale);
                return (<div key={cell.y} onClick={() => typeof cell.zone_id === 'number' ? setEditZone(cell.zone_id) : null} className='cursor-pointer'>
                    { cell && <Cell 
                      type={cell.type} 
                      coordinates={`${cell.x}-${cell.y}`}
                      cellStyle={{ 
                        height: `${scale}px`, 
                        width: `${scale}px`, 
                        ...borderStyle
                      }}
                    />}
                  </div>
                );
            })
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}