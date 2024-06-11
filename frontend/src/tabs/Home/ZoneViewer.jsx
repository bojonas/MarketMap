import React, { useRef, useContext, useEffect, useState } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';
import { MapViewerContext } from '../../context/MapViewerContext';
import { getNonBorderStyle } from '../MyMarket/getNonBorderStyle';
import { getBorderStyle } from '../MyMarket/getBorderStyle';

export default function ZoneViewer({ zone, zoom }) {
    const { images, borderCells} = useContext(MapViewerContext);

    const ref = useRef(null);
    const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width/ zone.columns, height / zone.rows);  

    // adjust scrollbars after zoom
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

    return (
        <div className='flex flex-col items-center gap-[2%]'>
            <p style={{ borderColor: `rgb(${zone.zone_color})` }} className='border-[0.5svh] text-center text-[3svh] placeholder:italic placeholder-white outline-none bg-gray-custom rounded-xl p-[1%] pr-[2%] pl-[2%]'>
                {zone.zone_name || 'Zone not named'}
            </p>
            <div className='min-w-[75svw] max-w-[75svw] flex content-center justify-center items-center text-center'>
                <div ref={ref} id='viewZone' className='border-[1svh] border-darkgray-custom overflow-scroll' style={dimensions}>
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
                                            { cell.zone_id === zone.zone_id && <CellViewer
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
            </div>
        </div>
    );     
};