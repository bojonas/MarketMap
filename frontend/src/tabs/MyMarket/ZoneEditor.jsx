import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import Cell from './Cell';
import ProductModal from './ProductModal';
import { getNonBorderStyle } from './getNonBorderStyle';
import { getBorderStyle } from './getBorderStyle';
import { MyMarketContext } from '../../context/MyMarketContext';
import { MapEditorContext } from '../../context/MapEditorContext';

export default function ZoneEditor({ zone, setEditedZones }) {
    const { borderCells } = useContext(MyMarketContext);
    const { openCell, setOpenCell, products } = useContext(MapEditorContext);

    const zone_layout = useMemo(() => {        
        // remove not selected rows and columns
        let newLayout = JSON.parse(JSON.stringify(zone.zone_layout));
        let rowsToKeep = new Set();
        let colsToKeep = new Set();
        for (let i = 0; i < newLayout.length; i++) {
            for (let j = 0; j < newLayout[0].length; j++) {
                if (typeof newLayout[i][j].zone_id !== 'number') continue;
                rowsToKeep.add(i);
                colsToKeep.add(j);
            }
        }
        newLayout = newLayout.filter((_, i) => rowsToKeep.has(i));
        return newLayout.map(row => row.filter((_, j) => colsToKeep.has(j))); 
    }, [zone.zone_layout])

    const ref = useRef(null);
    const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width / zone.columns, height / zone.rows);  
    const [name, setName] = useState(zone.zone_name);
    const [zoom, setZoom] = useState(1);

    // zoom effect on layout
    useEffect(() => {
        const handleWheel = (e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        const newZoom = zoom * (e.deltaY < 0 ? 1 + 0.1 : 1 - 0.1);
        setZoom(newZoom < 1 ? 1 : newZoom);
        };
    
        const container = document.querySelector('#editZone');
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

    const handleZoneNameChange = (e) => {
        const updatedZone = { ...zone, zone_name: e.target.value };
        setEditedZones((prevEditedZones) => {
            const updatedZones = [...prevEditedZones];
            const zoneIndex = updatedZones.findIndex((z) => z.zone_id === zone.zone_id);
            if (zoneIndex !== -1) {
                updatedZones[zoneIndex] = updatedZone;
            }
            return updatedZones;
        });
        setName(e.target.value);
    };

    return (
        <div className='flex flex-col items-center'>
            <input name='zoneName' value={name} placeholder='Zone not named' onChange={handleZoneNameChange} style={{ borderColor: `rgb(${zone.zone_color})` }} className='border-[0.5svh] w-[12svw] text-center text-[3svh] placeholder:italic placeholder-white outline-none bg-gray-custom rounded-xl pt-[1svh] pb-[1svh]'/>
            <div className='min-w-[75svw] max-w-[75svw] flex content-center justify-center items-center text-center'>
                <div className='flex flex-col items-center'>
                    <div className='flex items-center'>
                        <div ref={ref} id='editZone' className='border-[4svh] border-darkgray-custom overflow-scroll' style={dimensions}>
                            <div className='grid items-center justify-center content-center w-full h-full'>
                                <div  className='grid w-fit h-fit' 
                                    style={{ 
                                        gridTemplateColumns: `repeat(${zone.columns}, ${scale}px)`, 
                                        gridTemplateRows: `repeat(${zone.rows}, ${scale}px)`,
                                        transform: `scale(${zoom})`,
                                        transformOrigin: '0 0'
                                    }}>
                                    { zone.zone_layout.map((row, i) => (
                                        row.map((cell, j) => {
                                            let borderStyle = getNonBorderStyle(scale);
                                            if (borderCells.size && cell.zone_id === zone.zone_id) borderStyle = getBorderStyle(borderStyle, borderCells.get(cell.zone_id), cell.x, cell.y)
                                            return (
                                                <div key={j}>
                                                    { cell.zone_id === zone.zone_id && <Cell
                                                        type={cell.type}
                                                        row={cell.x}
                                                        col={cell.y}
                                                        cellStyle={{ 
                                                            height: `${scale}px`, 
                                                            width: `${scale}px`, 
                                                            ...borderStyle
                                                        }}
                                                    />}
                                                </div>
                                            )
                                        })
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProductModal
                openCell={openCell} 
                closeCell={() => setOpenCell(null)}
                products={products}/>
        </div>
    );     
};