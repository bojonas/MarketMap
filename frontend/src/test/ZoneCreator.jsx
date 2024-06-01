import React, { useState, useRef } from 'react';
import { Zone } from './Zone';
import { useAdjustScale } from '../hooks/useAdjustScale';
import { getItemImages } from '../helper/getItemImages';

export default function ZoneCreator() {
    const [dimensions, ] = useState({ width: '75svw', height: '75svh' });
    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);

    const [rowCount, ] = useState(30);
    const [colCount, ] = useState(30);
    const [zone, setZone] = useState(new Zone(0, Array(rowCount).fill().map(() => Array(colCount).fill(true)), {}));
    const [selectedCells, setSelectedCells] = useState(new Set());

    const createZone = () => {
        const shape = Array(rowCount).fill().map(() => Array(colCount).fill(false)); 
        selectedCells.forEach(cell => {
            const [row, col] = cell.split(',').map(Number);
            shape[row][col] = true;
        });
        setZone(new Zone(0, shape, {}));
        setSelectedCells(new Set());
    };

    const toggleCell = (row, col) => {
        const cell = `${row},${col}`;
        if (selectedCells.has(cell)) {
            selectedCells.delete(cell);
        } else {
            selectedCells.add(cell);
        }
        setSelectedCells(new Set(selectedCells));
    };

    const scale = Math.min(width/ colCount, height / rowCount);  
    return (
        <div className='text-black flex flex-col items-center justify-center w-full h-full'>
            <div ref={ref} style={dimensions}>
                <div className='grid w-full h-full items-center justify-center'
                    style={{ 
                        gridTemplateColumns: `repeat(${rowCount}, ${scale}px)`, 
                        gridTemplateRows: `repeat(${colCount}, ${scale}px)`
                    }}>
                    { zone.shape.map((row, rowIndex) => (
                        row.map((cell, colIndex) => {
                            const isSelected = selectedCells.has(`${rowIndex},${colIndex}`);
                            const inZone = zone.shape[rowIndex][colIndex];
                            return (
                                <div key={colIndex} onClick={() => toggleCell(rowIndex, colIndex)}>
                                    { inZone && <ZoneCell 
                                        type={'empty'}
                                        cellStyle={{ 
                                            //transform: `rotate(${layout[i][j]['rotation']}deg)`,
                                            height: `${scale}px`, 
                                            width: `${scale}px`, 
                                            border: `${scale/10}px solid #171717`,
                                            borderRadius: `${scale/5}px`,
                                            backgroundColor: isSelected ? '#715DF2' : ''
                                        }}
                                    />}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
            <button onClick={createZone} className='text-white'>Create Zone</button>
        </div>
    );     
};

const ZoneCell = React.memo(({ type, cellStyle }) => {
  const images = getItemImages();
  const source = images[type];
  return (
    <React.Fragment>
      { type !== 'empty' 
      ? <div className='flex justify-center items-center bg-[#d9d9d9] p-[5%] rounded-[5%] w-full h-full' style={cellStyle}>
          <img draggable='false' src={source} alt={type}/>
      </div>
      : <div className='flex justify-center items-center bg-gray-custom p-[5%] rounded-[5%] w-full h-full' style={cellStyle}/>
      }
    </React.Fragment>
  );
});

