import React, { useState, useRef, useContext } from 'react';
import { MapLayout } from './MapLayout';
import { Cell } from './Cell';
import { useAdjustScale } from '../hooks/useAdjustScale';
import { getItemImages } from '../helper/getItemImages';
import { MapLayoutContext } from '../context/MapLayoutContext';

export default function ZoneCreator({ rows, columns }) {
    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width/ columns, height / rows);  

    const { mapLayout, setMapLayout, setCreateZone } = useContext(MapLayoutContext);
    const layout = Array(rows).fill().map(() => Array(columns).fill(true));
    const [selectedCells, setSelectedCells] = useState(new Set());
    const [name, setName] = useState('');

    const saveZone = () => {
        const emptyLayout = Array(rows).fill().map((_, i) => Array(columns).fill().map((_, j) => new Cell(false, null, i, j, null)));
        selectedCells.forEach(cell => {
            const [row, col] = cell.split(',').map(Number);
            emptyLayout[row][col] = new Cell(true, 'empty', row, col, []);
        });
        // remove not filled rows and columns
        let newLayout = JSON.parse(JSON.stringify(emptyLayout));
        let rowsToKeep = new Set();
        let colsToKeep = new Set();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (newLayout[i][j].filled) {
                    rowsToKeep.add(i);
                    colsToKeep.add(j);
                }
            }
        }
        newLayout = newLayout.filter((_, i) => rowsToKeep.has(i));
        newLayout = newLayout.map(row => row.filter((_, j) => colsToKeep.has(j)));
        // copy mapLayout
        const newMapLayout = new MapLayout();
        newMapLayout.zones = new Map(mapLayout.zones);
        newMapLayout.idCounter = mapLayout.idCounter; 
        
        // add zone to mapLayout
        newMapLayout.addZone(name, newLayout);
        setMapLayout(newMapLayout);
        setCreateZone(false);
        
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

    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleMouseDown = (row, col) => {
        setIsMouseDown(true);
        toggleCell(row, col);
    };

    const handleMouseOver = (row, col) => {
        if (!isMouseDown || selectedCells.has(`${row},${col}`)) return;
        selectedCells.add(`${row},${col}`);
        setSelectedCells(new Set(selectedCells));
    };

    return (
        <div onMouseUp={() => setIsMouseDown(false)} className='flex flex-col items-center justify-center w-full h-full gap-[2%] p-[2%]'>
            <input value={name} placeholder='Zone Name' onChange={(e) => setName(e.target.value)} className='text-center placeholder:italic placeholder-white outline-none bg-gray-custom rounded-xl p-[1%]'/>
            <div ref={ref} className='flex w-full h-full items-center justify-center'>
                <div className='grid w-fit h-fit items-center justify-center'
                    style={{ 
                        gridTemplateColumns: `repeat(${columns}, ${scale}px)`, 
                        gridTemplateRows: `repeat(${rows}, ${scale}px)`
                    }}>
                    { layout.map((row, i) => (
                        row.map((cell, j) => {
                            const isSelected = selectedCells.has(`${i},${j}`);
                            const inLayout = layout[i][j];
                            return (
                                <div 
                                    key={j} 
                                    onMouseDown={() => handleMouseDown(i, j)}
                                    onMouseUp={() => setIsMouseDown(false)}
                                    onMouseOver={() => handleMouseOver(i, j)}
                                >
                                    { inLayout && <ZoneCell 
                                        type={'empty'}
                                        cellStyle={{ 
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
            <button onClick={saveZone}>Save</button>
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