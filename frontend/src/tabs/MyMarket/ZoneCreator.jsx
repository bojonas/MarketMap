import React, { useState, useRef, useContext, useEffect } from 'react';
import { MapLayout } from './classes/MapLayout';
import { Cell } from './classes/Cell';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import { generateRGBColor } from '../Home/colors';
import ZoneCellViewer from './ZoneCellViewer';
import { MyMarketContext } from '../../context/MyMarketContext';
import { requestDeleteMarketZones, requestUpdateMapLayout, requestUpdateMarketZones } from '../../requests/myMarketRequests';
import { MapEditorContext } from '../../context/MapEditorContext';

export default function ZoneCreator() {
    const { setMapLayout, borderCells, zones, setZones, setSaveMessage } = useContext(MyMarketContext);
    const { layout, setLayout, editedZones, setEditedZones, setAddZone, save, setSave } = useContext(MapEditorContext);
    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);

    const rows = layout.length;
    const columns = layout[0].length
    const scale = Math.min(width/ columns, height / rows);  
    const [selectedCells, setSelectedCells] = useState(new Set());
    const [name, setName] = useState('');

    useEffect(() => {
        if (!save) return;
        const saveZone = async () => {
            const user_id = localStorage.getItem('user_id');
            // copy mapLayout
            const newMapLayout = new MapLayout(rows, columns);
            newMapLayout.build(JSON.parse(JSON.stringify(layout)), JSON.parse(JSON.stringify(editedZones)));

            let newLayout = Array(rows).fill().map((_, i) => Array(columns).fill().map((_, j) => new Cell(null, 'empty', i, j, [])));
            selectedCells.forEach(cell => {
                const [row, col] = cell.split(',').map(Number);
                if (!row || !col) {
                    setAddZone(false);
                    setSave(false);
                    return setSaveMessage('No Changes');
                }
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
            newMapLayout.setZoneColor(newZone.zone_id, generateRGBColor(newZone.zone_id, Array.from(newMapLayout.zones.values()).map(zone => zone.zone_id)));
            
            const zone = newMapLayout.getZone(newZone.zone_id);
            if (!zone || zone.zone_layout.length === 0) {
                setAddZone(false);
                setSave(false);
                return setSaveMessage('No Changes');
            }

            await requestUpdateMarketZones(user_id, [zone]);

            const newZones = JSON.parse(JSON.stringify(Array.from(newMapLayout.zones.values())));
            const zonesToDelete = zones.filter(zone => !newZones.some(newZone => newZone.zone_id === zone.zone_id));
            if (zonesToDelete.length > 0) await requestDeleteMarketZones(user_id, zonesToDelete.map(zone => zone.zone_id));

            if (zone || zonesToDelete.length > 0) await requestUpdateMapLayout(user_id, newMapLayout.map_layout);

            setLayout(JSON.parse(JSON.stringify(newMapLayout.map_layout)));
            setEditedZones(newZones);
            setZones(newZones);
            setMapLayout(newMapLayout);           
            setAddZone(false);
            setSave(false);
            setSaveMessage('Zone created');
        }   
        saveZone();
    }, [save, setSave, rows, columns, editedZones, layout, name, zones, selectedCells, setAddZone, setEditedZones, setLayout, setMapLayout, setZones, setSaveMessage]);    

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
        <div onMouseUp={() => setIsMouseDown(false)} className='flex flex-col items-center justify-center p-[2%] gap-[2%] w-full h-full'>
            <input name='zoneName' value={name} placeholder='Zone Name' onChange={(e) => setName(e.target.value)} className='text-center placeholder:italic placeholder-white outline-none bg-gray-custom rounded-xl px-[1.5%] py-[2%]'/>
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
        </div>
    );     
};