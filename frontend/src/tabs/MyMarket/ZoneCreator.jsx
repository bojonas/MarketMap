import React, { useState, useRef, useContext } from 'react';
import { MapLayout } from './classes/MapLayout';
import { Cell } from './classes/Cell';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import { colorArray } from '../Home/colors';
import ZoneCellViewer from './ZoneCellViewer';
import { MyMarketContext } from '../../context/MyMarketContext';
import { IoArrowBack } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";
import { requestUpdateMarketZones } from '../../requests/myMarketRequests';

export default function ZoneCreator({ setAddZone }) {
    const { mapLayout, setMapLayout, setZones, borderCells } = useContext(MyMarketContext);
    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);

    const layout = mapLayout.map_layout;
    const rows = layout.length;
    const columns = layout[0].length
    const scale = Math.min(width/ columns, height / rows);  
    const [selectedCells, setSelectedCells] = useState(new Set());
    const [name, setName] = useState('');

    const saveZone = async () => {
        // copy mapLayout
        const newMapLayout = new MapLayout(rows, columns);
        newMapLayout.map_layout = mapLayout.map_layout;
        newMapLayout.zones = new Map(mapLayout.zones);
        newMapLayout.idCounter = mapLayout.idCounter;

        let newLayout = Array(rows).fill().map((_, i) => Array(columns).fill().map((_, j) => new Cell(null, 'empty', i, j, [])));
        selectedCells.forEach(cell => {
            const [row, col] = cell.split(',').map(Number);
            newLayout[row][col] = new Cell(newMapLayout.idCounter, newMapLayout.map_layout[row][col].type || 'empty', row, col, newMapLayout.map_layout[row][col].products || []);
        });
        
        // remove not selected rows and columns
        let rowsToKeep = new Set();
        let colsToKeep = new Set();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (typeof newLayout[i][j].zone_id !== 'number') continue;
                rowsToKeep.add(i);
                colsToKeep.add(j);
            }
        }
        newLayout = newLayout.filter((_, i) => rowsToKeep.has(i));
        newLayout = newLayout.map(row => row.filter((_, j) => colsToKeep.has(j))); 

        // get top left position of zone
        let minRow = rows, minCol = columns;
        selectedCells.forEach(cell => {
            const [row, col] = cell.split(',').map(Number);
            minRow = Math.min(minRow, row);
            minCol = Math.min(minCol, col);
        });
        // add zone to mapLayout
        newMapLayout.addZone(name, newLayout, { row: minRow, column: minCol }, colorArray[newMapLayout.idCounter]); // color picker
        setMapLayout(newMapLayout);
        setZones(Array.from(newMapLayout.zones.values()));
        const zone = newMapLayout.getZone(newMapLayout.idCounter-1);
        if (zone) {
            await requestUpdateMarketZones(localStorage.getItem('user_id'), [zone]);
            alert('Zone created');
        }
        setAddZone(false);
    };    

    const toggleCell = (row, col) => {
        const cell = `${row},${col}`;
        if (selectedCells.has(cell))  selectedCells.delete(cell);
        else selectedCells.add(cell);
        setSelectedCells(new Set(selectedCells));
    };

    const [isMouseDown, setIsMouseDown] = useState(false);

    const handleMouseDown = (e, row, col) => {
        e.preventDefault();
        setIsMouseDown(true);
        toggleCell(row, col);
    };

    const handleMouseOver = (e, row, col) => {
        e.preventDefault();
        if (!isMouseDown || selectedCells.has(`${row},${col}`)) return;
        selectedCells.add(`${row},${col}`);
        setSelectedCells(new Set(selectedCells));
    };

    const handleMouseUp = () => {    
        // floodfill algorithm
        const selectedCoordinates = Array.from(selectedCells).map(cell => cell.split(',').map(Number));
        const avgRow = Math.round(selectedCoordinates.reduce((sum, coord) => sum + coord[0], 0) / selectedCoordinates.length);
        const avgCol = Math.round(selectedCoordinates.reduce((sum, coord) => sum + coord[1], 0) / selectedCoordinates.length);

        const stack = [[avgRow, avgCol]];
        const tempSelectedCells = new Set(selectedCells);
        while (stack.length) {
            const [row, col] = stack.pop();
            if (row > 0 && !tempSelectedCells.has(`${row - 1},${col}`) && (layout[row - 1][col] || tempSelectedCells.has(`${row - 1},${col}`))) stack.push([row - 1, col]);
            if (row < rows - 1 && !tempSelectedCells.has(`${row + 1},${col}`) && (layout[row + 1][col] || tempSelectedCells.has(`${row + 1},${col}`))) stack.push([row + 1, col]);
            if (col > 0 && !tempSelectedCells.has(`${row},${col - 1}`) && (layout[row][col - 1] || tempSelectedCells.has(`${row},${col - 1}`))) stack.push([row, col - 1]);
            if (col < columns - 1 && !tempSelectedCells.has(`${row},${col + 1}`) && (layout[row][col + 1] || tempSelectedCells.has(`${row},${col + 1}`))) stack.push([row, col + 1]);
            tempSelectedCells.add(`${row},${col}`);
        }

        if (tempSelectedCells.size !== rows * columns) setSelectedCells(tempSelectedCells);
        setIsMouseDown(false);
    };
    return (
        <div onMouseUp={() => setIsMouseDown(false)} className='flex flex-col items-center justify-center p-[1%] gap-[4%] w-full h-full'>
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
                            return (
                                <div 
                                    key={j} 
                                    onMouseDown={(e) => handleMouseDown(e, i, j)}
                                    onMouseUp={handleMouseUp}
                                    onMouseOver={(e) => handleMouseOver(e, i, j)}
                                >
                                    { cell && <ZoneCellViewer
                                        type={cell.type}
                                        cellStyle={{ 
                                            height: `${scale}px`, 
                                            width: `${scale}px`, 
                                            border: `${scale/10}px solid #171717`,
                                            borderRadius: `${scale/5}px`,
                                            backgroundColor: isSelected ? '#715DF2' : borderCells.size && typeof cell.zone_id === 'number' ? `rgba(${borderCells.get(cell.zone_id).zone_color}, 0.3)` : ''
                                        }}
                                    />}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
            <div className='w-full flex gap-[5%] items-center justify-center content-center'>
                <div onClick={() => setAddZone(false)} className='custom-button gap-[10%] bg-darkgray-custom border-darkgray-custom hover:border-offwhite h-[5.5svh] text-[2.2svh] cursor-pointer'>
                    <IoArrowBack size={25}/>
                    <p>Back</p>
                </div>
                <div onClick={saveZone} className='custom-button gap-[10%] bg-offwhite border-offwhite hover:border-darkgray-custom text-black h-[5.5svh] text-[2.2svh] cursor-pointer'>
                    <FaRegSave size={25}/>
                    <p>Create</p>
                </div>
            </div>
        </div>
    );     
};