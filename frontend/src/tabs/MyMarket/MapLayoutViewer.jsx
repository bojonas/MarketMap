import React, { useState, useRef, useContext } from 'react';
import ZoneCreator from "./ZoneCreator";
import ZoneEditor from './ZoneEditor';
import ZoneCellViewer from './ZoneCellViewer';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import { getBorderStyle } from './getBorderStyle';
import { getNonBorderStyle } from './getNonBorderStyle';
import { MyMarketContext } from '../../context/MyMarketContext';
import { MapLayoutContext } from '../../context/MapLayoutContext';

export default function MapLayoutViewer() {
    const { mapLayout, setMapLayout, images, borderCells } = useContext(MyMarketContext);
    const rows = mapLayout.map_layout.length;
    const columns = mapLayout.map_layout[0].length;
    const [createZone, setCreateZone] = useState(false);
    const [editZone, setEditZone] = useState(null);

    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width/ columns, height / rows);

    return (
        <MapLayoutContext.Provider value={{ mapLayout, setMapLayout, images, borderCells }}>
            <div className='flex flex-col items-center justify-center w-full h-full'>
                <div className='flex flex-col items-center justify-center w-[75svw] h-[75svh]'>
                    { typeof editZone === 'number' ? <ZoneEditor zone={mapLayout.getZone(editZone)} setEditZone={setEditZone}/> 
                    : createZone ? <ZoneCreator setCreateZone={setCreateZone}/> 
                        : <div ref={ref} className='w-full h-full p-[1svh] flex flex-col items-center justify-center'>
                            <div className='grid w-fit h-fit items-center justify-center'
                                style={{ 
                                    gridTemplateColumns: `repeat(${columns}, ${scale}px)`, 
                                    gridTemplateRows: `repeat(${rows}, ${scale}px)`
                                }}>
                                { mapLayout.map_layout.map((row, i) => (
                                    row.map((cell, j) =>  {
                                        let borderStyle = getNonBorderStyle(scale);
                                        if (borderCells.size && typeof cell.zone_id === 'number') borderStyle = getBorderStyle(borderStyle, borderCells.get(cell.zoneid), i, j, scale);
                                        return (
                                            <div key={j} onClick={() => typeof cell.zone_id === 'number' ? setEditZone(cell.zoneid) : null} className='cursor-pointer'>
                                                { cell && <ZoneCellViewer 
                                                    type={cell.type || 'empty'}
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
                    }
                </div>
                { editZone === null && !createZone && 
                    <div onClick={() => setCreateZone(true)} className='flex items-center justify-center gap-[5%] w-[8svw] h-fit rounded-full hover:bg-gray-custom cursor-pointer'>
                        <p className='text-[4svh]'>+</p>
                        <p>add Zone</p>
                    </div>
                }
            </div>
        </MapLayoutContext.Provider>
    );
}