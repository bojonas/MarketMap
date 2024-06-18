import React, { useState, useRef, useContext } from 'react';
import { MapLayout } from './classes/MapLayout';
import { Cell } from './classes/Cell';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import { colorArray } from '../Home/colors';
import ZoneCellViewer from './ZoneCellViewer';
import { MyMarketContext } from '../../context/MyMarketContext';
import { IoArrowBack } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";
import { requestDeleteMarketZones, requestUpdateMarketZones } from '../../requests/myMarketRequests';
import { MapEditorContext } from '../../context/MapEditorContext';

export default function ZoneCreator({ setAddZone }) {
    const { setMapLayout, borderCells, zones, setZones } = useContext(MyMarketContext);
    const { layout, setLayout, editedZones, setEditedZones } = useContext(MapEditorContext);
    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);

    const rows = layout.length;
    const columns = layout[0].length
    const scale = Math.min(width/ columns, height / rows);  
    const [selectedCells, setSelectedCells] = useState(new Set());
    const [name, setName] = useState('');

    const saveZone = async () => {
        // copy mapLayout
        const newMapLayout = new MapLayout(rows, columns);
        newMapLayout.build(JSON.parse(JSON.stringify(layout)), JSON.parse(JSON.stringify(editedZones)));

        let newLayout = Array(rows).fill().map((_, i) => Array(columns).fill().map((_, j) => new Cell(null, 'empty', i, j, [])));
        selectedCells.forEach(cell => {
            const [row, col] = cell.split(',').map(Number);
            newLayout[row][col] = new Cell(newMapLayout.idCounter, newMapLayout.map_layout[row][col].type || 'empty', row, col, newMapLayout.map_layout[row][col].products || [], newMapLayout.map_layout[row][col].rotation);
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
        const newZone = newMapLayout.addZone(null, name, newLayout, { row: minRow, column: minCol });
        newMapLayout.setZoneColor(newZone.zone_id, colorArray[newZone.zone_id]);
        
        const zone = newMapLayout.getZone(newZone.zone_id);
        if (zone) {
            await requestUpdateMarketZones(localStorage.getItem('user_id'), [zone]);
            alert('Zone created');
        }

        const newZones = Array.from(newMapLayout.zones.values());
        const zonesToDelete = zones.filter(zone => !newZones.some(newZone => newZone.zone_id === zone.zone_id));
        if (zonesToDelete && zonesToDelete.length > 0) {
            await requestDeleteMarketZones(localStorage.getItem('user_id'), zonesToDelete);
        }

        setLayout(JSON.parse(JSON.stringify(newMapLayout.map_layout)));
        setEditedZones(newZones);
        setZones(newZones)
        setMapLayout(newMapLayout);
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
            <input name='zoneName' value={name} placeholder='Zone Name' onChange={(e) => setName(e.target.value)} className='text-center placeholder:italic placeholder-white outline-none bg-gray-custom rounded-xl p-[1%]'/>
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
                                            transform: `rotate(${cell.rotation}deg)`,
                                            borderRadius: `${scale/5}px`,
                                            backgroundColor: isSelected 
                                                ? window.getComputedStyle(document.documentElement).getPropertyValue('--primary-color') 
                                                : borderCells.size && typeof cell.zone_id === 'number' ? `rgba(${borderCells.get(cell.zone_id).zone_color}, ${cell.type === 'empty' ? '0.2' : '1'})` : ''
                                        }}
                                    />}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
            <div className='w-full flex gap-[5%] items-center justify-center content-center'>
                <div onClick={() => setAddZone(false)} className='custom-button gap-[10%] bg-darkgray-custom border-darkgray-custom border-secondary-hover h-[5.5svh] text-[2.2svh] cursor-pointer'>
                    <IoArrowBack size={25}/>
                    <p>Back</p>
                </div>
                <div onClick={saveZone} className='custom-button gap-[10%] bg-offwhite border-offwhite border-primary-hover text-black h-[5.5svh] text-[2.2svh] cursor-pointer'>
                    <FaRegSave size={25}/>
                    <p>Create</p>
                </div>
            </div>
        </div>
    );     
};