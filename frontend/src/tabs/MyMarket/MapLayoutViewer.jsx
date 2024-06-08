import React, { useState, useRef } from 'react';
import { MapLayout } from "./classes/MapLayout";
import ZoneCreator from "./ZoneCreator";
import { MapLayoutContext } from '../../context/MapLayoutContext';
import ZoneEditor from './ZoneEditor';
import { getItemImages } from '../../helper/getItemImages';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import { findBorderCells } from './findBorderCells';
import { getBorderStyle } from './getBorderStyle';

export default function MapLayoutViewer() {
    const [rows, columns] = [15, 15];
    const images = getItemImages();
    const [mapLayout, setMapLayout] = useState(new MapLayout(rows, columns));
    const [createZone, setCreateZone] = useState(false);
    const [editZone, setEditZone] = useState(null);

    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width/ columns, height / rows);

    const borderCells = new Map();
    for (const zone of mapLayout.zones.values()) {
        borderCells.set(zone.id, { border: findBorderCells(zone.layout), color: zone.color });
    }    
    
    return (
        <MapLayoutContext.Provider value={{ mapLayout, setMapLayout, images }}>
            <div className='flex flex-col items-center justify-center w-full h-full'>
                <div className='flex flex-col items-center justify-center w-[75svw] h-[75svh]'>
                    { editZone !== null ? <ZoneEditor zone={mapLayout.getZone(editZone)} setEditZone={setEditZone}/> 
                    : createZone ? <ZoneCreator setCreateZone={setCreateZone} rows={15} columns={15}/> 
                        : <div ref={ref} className='w-full h-full p-[1svh] flex flex-col items-center justify-center'>
                            <div className='grid w-fit h-fit items-center justify-center'
                                style={{ 
                                    gridTemplateColumns: `repeat(${columns}, ${scale}px)`, 
                                    gridTemplateRows: `repeat(${rows}, ${scale}px)`
                                }}>
                                { mapLayout.map_layout.map((row, i) => (
                                    row.map((cell, j) =>  {
                                        let borderStyle = {};
                                        if (borderCells.size && typeof cell.zoneid === 'number') borderStyle = getBorderStyle(borderCells.get(cell.zoneid), i, j);
                                        return (
                                            <div key={j} onClick={() => typeof cell.zoneid === 'number' ? setEditZone(cell.zoneid) : null} className='cursor-pointer'>
                                                { cell && <ZoneCellViewer 
                                                    type={cell.type || 'empty'}
                                                    cellStyle={{ 
                                                        height: `${scale}px`, 
                                                        width: `${scale}px`, 
                                                        border: `${scale/10}px solid #171717`,
                                                        borderRadius: `${scale/5}px`,
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
               { editZone === null && !createZone && <div onClick={() => setCreateZone(true)} className='flex items-center justify-center gap-[5%] w-[8svw] h-fit rounded-full hover:bg-gray-custom cursor-pointer'>
                    <p className='text-[4svh]'>+</p>
                    <p>add Zone</p>
                </div>}
            </div>
        </MapLayoutContext.Provider>
    );
}

const ZoneCellViewer = React.memo(({ type, cellStyle }) => {
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