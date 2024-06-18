import React, { useRef, useEffect, useState } from 'react';
import Cell from './Cell';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import { useContext } from 'react';
import { MyMarketContext } from '../../context/MyMarketContext';
import { MapEditorContext } from '../../context/MapEditorContext';

export default function LayoutEditor() {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
  const { width, height } = useAdjustScale(ref);
  const { borderCells } = useContext(MyMarketContext);
  const { setEditZone, layout } = useContext(MapEditorContext);
  const scale = Math.min(width / layout[0].length, height / layout.length);
  const [zoom, setZoom] = useState(1);

  // zoom effect on layout
  useEffect(() => {
    const handleWheel = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const newZoom = zoom * (e.deltaY < 0 ? 1 + 0.1 : 1 - 0.1);
      setZoom(newZoom < 1 ? 1 : newZoom);
    };
  
    const container = document.querySelector('#editLayout');
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom]);

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
    <div className='flex flex-col items-center'>
      <div className='flex items-center'>
        <div ref={ref} id='editLayout' className='border-[1svh] border-darkgray-custom overflow-scroll' style={dimensions}>
          <div className='grid w-fit h-fit' 
            style={{ 
              gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
              gridTemplateRows: `repeat(${layout.length}, ${scale}px)`, 
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}>
            { layout.map((row, i) => (
              row.map((cell, j) => (
                <div key={cell.y} onClick={() => typeof cell.zone_id === 'number' ? setEditZone(cell.zone_id) : null}>
                  { cell && <Cell 
                    type={cell.type} 
                    row={cell.x}
                    col={cell.y}
                    cellStyle={{ 
                      height: `${scale}px`, 
                      width: `${scale}px`, 
                      transform: `rotate(${cell.rotation}deg)`,
                      border: `${scale/10}px solid #171717`,
                      borderRadius: `${scale/5}px`,
                      backgroundColor: borderCells.size && typeof cell.zone_id === 'number' ? `rgba(${borderCells.get(cell.zone_id).zone_color}, ${cell.type === 'empty' ? '0.2' : '1'})` : ''
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