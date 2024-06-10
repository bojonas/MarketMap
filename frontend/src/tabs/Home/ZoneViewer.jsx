import React, { useRef, useContext } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';
import { MapViewerContext } from '../../context/MapViewerContext';
import { getNonBorderStyle } from '../MyMarket/getNonBorderStyle';
import { getBorderStyle } from '../MyMarket/getBorderStyle';

export default function ZoneViewer({ zone }) {
    const { images, borderCells} = useContext(MapViewerContext);
    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width/ zone.columns, height / zone.rows);  

    return (
        <div className='flex flex-col items-center justify-center w-full h-full gap-[2%] p-[2%]'>
            <p style={{ borderColor: `rgb(${zone.zone_color})` }} className='border-[0.5svh] text-center placeholder:italic placeholder-white outline-none bg-gray-custom rounded-xl p-[1%] w-[8svw]'>{zone.zone_name}</p>
            <div ref={ref} className='p-[1svh] flex flex-col items-center justify-center w-[75svw] h-[75svh]'>
                <div className='grid items-center justify-center content-center w-full h-full'
                    style={{ 
                        gridTemplateColumns: `repeat(${zone.columns}, ${scale}px)`, 
                        gridTemplateRows: `repeat(${zone.rows}, ${scale}px)`
                    }}>
                    { zone.zone_layout.map((row, i) => (
                        row.map((cell, j) => {
                            let borderStyle = getNonBorderStyle(scale);
                            if (borderCells.size && typeof cell.zone_id === 'number') borderStyle = getBorderStyle(borderStyle, borderCells.get(cell.zone_id), cell.x, cell.y)
                            return (
                                <div key={j}>
                                    { typeof cell.zone_id === 'number' && <CellViewer
                                        type={cell.type}
                                        source={images[cell.type]}
                                        cellStyle={{ 
                                            height: `${scale}px`, 
                                            width: `${scale}px`, 
                                            ...borderStyle
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