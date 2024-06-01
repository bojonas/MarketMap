import React, { useState } from 'react';
import { Zone } from './Zone';
import { getItemImages } from '../helper/getItemImages';

export default function ZoneCreator() {
    const [rowCount, ] = useState(10);
    const [colCount, ] = useState(10);
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

    return (
        <div className='text-black flex flex-col items-center justify-center w-full h-full'>
            <div className='grid w-[75svw] h-[75svh] gap-[1%]'
                style={{ 
                    gridTemplateColumns: `repeat(${rowCount}, 1fr)`, 
                    gridTemplateRows: `repeat(${colCount}, 1fr)`
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
                                        backgroundColor: isSelected ? '#715DF2' : ''
                                    }}
                                />}
                            </div>
                        );
                    })
                ))}
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

