import React, { useState, useRef, useContext } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from '../Home/CellViewer';
import { MapViewerContext } from '../../context/MapViewerContext';

export default function ZoneViewer({ zone, setViewZone }) {
    const { images } = useContext(MapViewerContext);
    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width/ zone.columns, height / zone.rows);  
    const [name, setName] = useState(zone.name);

    const handleBack = () => {
        setViewZone(null);
    }

    return (
        <div className='flex flex-col items-center justify-center w-full h-full gap-[2%] p-[2%]'>
            <input value={name} placeholder='Zone not named' onChange={(e) => setName(e.target.value)} className='text-center placeholder:italic placeholder-white outline-none bg-gray-custom rounded-xl p-[1%]'/>
            <div ref={ref} className='p-[1svh] flex flex-col items-center justify-center w-[75svw] h-[75svh]'>
                <div className='grid items-center justify-center content-center w-full h-full'
                    style={{ 
                        gridTemplateColumns: `repeat(${zone.columns}, ${scale}px)`, 
                        gridTemplateRows: `repeat(${zone.rows}, ${scale}px)`
                    }}>
                    { zone.zone_layout.map((row, i) => (
                        row.map((cell, j) => (
                                <div key={j}>
                                    { typeof cell.zone_id === 'number' && <CellViewer
                                        type={cell.type}
                                        source={images[cell.type]}
                                        cellStyle={{ 
                                            height: `${scale}px`, 
                                            width: `${scale}px`, 
                                            border: `${scale/10}px solid #171717`,
                                            borderRadius: `${scale/5}px`,
                                        }}
                                    />}
                                </div>
                            )
                        )
                    ))}
                </div>
            </div>
            <button onClick={handleBack}>Back</button>
        </div>
    );     
};