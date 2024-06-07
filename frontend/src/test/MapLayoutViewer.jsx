import React, { useState, useRef, useEffect } from 'react';
import { MapLayout } from "./MapLayout";
import ZoneCreator from "./ZoneCreator";
import { MapLayoutContext } from '../context/MapLayoutContext';
import ZoneEditor from './ZoneEditor';
import { getItemImages } from '../helper/getItemImages';
import { colors } from '../tabs/Home/colors';
import { Cell } from './Cell';

export default function MapLayoutViewer() {
    const [rows, columns] = [15, 15];
    const images = getItemImages();
    const [mapLayout, setMapLayout] = useState(new MapLayout(rows, columns));
    const [createZone, setCreateZone] = useState(false);
    const [editZone, setEditZone] = useState(null);
    const ref = useRef(null);

    const [dim, setDim] = useState({ width: 0, height: 0 });
    const scale = Math.min(dim.width / columns, dim.height / rows);  

    useEffect(() => {
        if (ref.current) {
            const width = ref.current.offsetWidth;
            const height = ref.current.offsetHeight;
            setDim({ width: width, height: height });
        }
    }, []);

    /*const dragItem = useRef();
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
    }*/

    return (
        <MapLayoutContext.Provider value={{ mapLayout, setMapLayout, setCreateZone, images }}>
            <div className='flex flex-col items-center justify-center w-full h-full'>
                <div className='flex flex-col items-center justify-center w-[75svw] h-[75svh]'>
                    { editZone !== null ? <ZoneEditor zone={mapLayout.getZone(editZone)} setEditZone={setEditZone}/> 
                    : createZone ? <ZoneCreator setMapLayout={setMapLayout} rows={15} columns={15}/> 
                        : <div ref={ref} className='w-full h-full p-[1svh] flex flex-col items-center justify-center'>
                            <div className='grid w-fit h-fit items-center justify-center'
                                style={{ 
                                    gridTemplateColumns: `repeat(${columns}, ${scale}px)`, 
                                    gridTemplateRows: `repeat(${rows}, ${scale}px)`
                                }}>
                                { mapLayout.map_layout.map((row, i) => (
                                    row.map((cell, j) =>  (
                                        <div key={j} onClick={() => cell instanceof Cell ? setEditZone(cell.zoneid) : null} className='cursor-pointer'>
                                            { cell && <ZoneCellViewer 
                                                type={cell.type || 'empty'}
                                                cellStyle={{ 
                                                    height: `${scale}px`, 
                                                    width: `${scale}px`, 
                                                    border: `${scale/10}px solid #171717`,
                                                    borderRadius: `${scale/5}px`,
                                                    backgroundColor: colors[cell.zoneid]
                                                }}
                                            />}
                                        </div>
                                    )
                                )))}
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