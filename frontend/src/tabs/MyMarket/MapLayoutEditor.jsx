import React, { useState, useRef } from 'react';
import { MapLayout } from "./classes/MapLayout";
import ZoneCreator from "./ZoneCreator";
import { MapLayoutContext } from '../../context/MapLayoutContext';
import ZoneViewer from './ZoneViewer';
import ZoneEditor from './ZoneEditor';
import { getItemImages } from '../../helper/getItemImages';

export default function MapLayoutEditor() {
    const images = getItemImages();
    const [mapLayout, setMapLayout] = useState(new MapLayout(15, 15));
    const [createZone, setCreateZone] = useState(false);
    const [editZone, setEditZone] = useState(null);

    const dragItem = useRef();
    const dragItemNode = useRef();

    const handleDragStart = (e, item) => {
        dragItemNode.current = e.target;
        dragItemNode.current.addEventListener('dragend', handleDragEnd);
        dragItem.current = item;
    }

    const handleDragEnd = (e) => {
        dragItem.current = null;
        dragItemNode.current.removeEventListener('dragend', handleDragEnd);
        dragItemNode.current = null;
    }

    const handleDrop = (e, targetItem) => {
        if (dragItemNode.current !== e.target) {
            setMapLayout(oldMapLayout => {
                const newMapLayout = new MapLayout();
                newMapLayout.zones = new Map(oldMapLayout.zones);
                newMapLayout.idCounter = oldMapLayout.idCounter; 
                newMapLayout.swapZones(dragItem.current.id, targetItem.id);
                return newMapLayout;
            });
        }
    }

    return (
        <MapLayoutContext.Provider value={{ mapLayout, setMapLayout, setCreateZone, images }}>
            <div className='flex items-center justify-center'>
                <div className='flex items-center justify-center w-[80svw] h-[80svh]'>
                    { editZone ? <ZoneEditor zone={editZone}/> 
                    : createZone ? <ZoneCreator setMapLayout={setMapLayout} rows={15} columns={15}/> 
                        : <div className='gap-[5%] flex items-center overflow-scroll'>
                            { mapLayout && Array.from(mapLayout.zones.values()).map(zone => (
                                <div key={zone.id} className='flex flex-col content-center items-center justify-center gap-[4%] transition-all duration-500 ease-in-out'>
                                    {zone.name || 'Zone not named'}
                                    <div draggable className='rounded-xl border-darkgray-custom border-[0.5svh] hover:border-purple-custom cursor-pointer'
                                        onDragStart={(e) => handleDragStart(e, zone)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, zone)}
                                        onClick={() => setEditZone(zone)}
                                    >
                                        <ZoneViewer layout={zone.layout} rows={zone.rows} columns={zone.columns}/>
                                    </div>
                                </div>
                            ))}
                            <div onClick={() => setCreateZone(true)} className='flex items-center justify-center gap-[5%] w-[8svw] h-fit rounded-full hover:bg-gray-custom cursor-pointer'>
                                <p className='text-[4svh]'>+</p>
                                <p>add Zone</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </MapLayoutContext.Provider>
    );
}