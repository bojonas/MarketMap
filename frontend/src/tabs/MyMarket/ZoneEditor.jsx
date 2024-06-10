import React, { useState, useRef, useContext } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import Cell from './Cell';
import ProductModal from './ProductModal';
import { getNonBorderStyle } from './getNonBorderStyle';
import { getBorderStyle } from './getBorderStyle';
import { MyMarketContext } from '../../context/MyMarketContext';
import { MapEditorContext } from '../../context/MapEditorContext';

export default function ZoneEditor({ zone }) {
    const { borderCells } = useContext(MyMarketContext);
    const { openCell, setOpenCell, products} = useContext(MapEditorContext);
    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width / zone.columns, height / zone.rows);  
    const [name, setName] = useState(zone.zone_name);

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
                        row.map((cell, j) => {
                            let borderStyle = getNonBorderStyle(scale);
                            if (borderCells.size && typeof cell.zone_id === 'number') borderStyle = getBorderStyle(borderStyle, borderCells.get(cell.zone_id), cell.x, cell.y)
                            return (
                                <div key={j}>
                                    { typeof cell.zone_id === 'number' && <Cell
                                        type={cell.type}
                                        coordinates={`${cell.x}-${cell.y}`}
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
            <ProductModal
                openCell={openCell} 
                closeCell={() => setOpenCell(null)}
                products={products}/>
        </div>
    );     
};