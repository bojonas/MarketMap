import React, { useRef, useContext, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';
import { MapViewerContext } from '../../context/MapViewerContext';
import { getNonBorderStyle } from '../MyMarket/getNonBorderStyle';
import { getBorderStyle } from '../MyMarket/getBorderStyle';
import Path from '../../atoms/Path';
import { generateColor } from './colors';

export default function ZoneViewer({ zone }) {
    const { shoppingCart, productsInMarket, layoutIndex, images, borderCells, path, waypoints } = useContext(MapViewerContext);

    const zonePath = path.map(([row, col]) => ([row - zone.zone_position.row, col - zone.zone_position.column])).filter(([row, col]) => (path[0] || (row >= 0 && col >= 0 && row < zone.rows && col < zone.columns)))
    const zoneWaypoints = waypoints.map(([row, col]) => ([row - zone.zone_position.row, col - zone.zone_position.column])).filter(([row, col]) => (row >= 0 && col >= 0 && row < zone.rows && col < zone.columns))

    const ref = useRef(null);
    const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width / zone.columns, height / zone.rows);  
    const [zoom, setZoom] = useState(1);

    // zoom effect on layout
    useEffect(() => {
        const handleWheel = (e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        const newZoom = zoom * (e.deltaY < 0 ? 1 + 0.1 : 1 - 0.1);
        setZoom(newZoom < 1 ? 1 : newZoom);
        };
    
        const container = document.querySelector('#viewZone');
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
        <div className='flex flex-col items-center'>
            <p style={{ borderColor: `rgb(${zone.zone_color})` }} className='border-[0.5svh] text-center text-[3svh] placeholder:italic placeholder-white outline-none bg-gray-custom rounded-xl p-[1%] pr-[2%] pl-[2%]'>
                {zone.zone_name || 'Zone not named'}
            </p>
            <div className='min-w-[75svw] max-w-[75svw] flex content-center justify-center items-center text-center'>
                <div className='flex flex-col items-center'>
                    <div className='flex items-center'>
                        <div ref={ref} id='viewZone' className='border-[4svh] border-darkgray-custom overflow-scroll' style={dimensions}>
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
                                            <div key={j} className='relative'>
                                                { cell.zone_id === zone.zone_id && <React.Fragment>
                                                    <CellViewer
                                                        type={cell.type}
                                                        source={images[cell.type]}
                                                        cellStyle={{ 
                                                            height: `${scale}px`, 
                                                            width: `${scale}px`,
                                                            ...borderStyle
                                                        }}
                                                        imgStyle={{ transform: `rotate(${cell.rotation}deg)` }}
                                                    />
                                                    { productsInMarket.filter(product => product.row === cell.x && product.column === cell.y).flatMap(marketProduct => {
                                                        const shoppingCartProduct = shoppingCart.products.find(cartProduct => cartProduct.product_id === marketProduct.product_id);
                                                        return shoppingCartProduct ? (
                                                            <div key={marketProduct.product_id} className='absolute top-1/2 left-1/2 rounded-full hover:cursor-pointer'
                                                                style={{ 
                                                                width: `${scale/2}px`, 
                                                                height: `${scale/2}px`,
                                                                backgroundColor: generateColor(layoutIndex[marketProduct.row.toString() + marketProduct.column.toString()], Object.values(layoutIndex)),
                                                                transform: 'translate(-50%, -50%)',
                                                                }}
                                                                data-tooltip-id={`info-${i}-${j}`} 
                                                                data-tooltip-html={
                                                                shoppingCart.products.filter(cartProduct => 
                                                                    productsInMarket.some(marketProduct => 
                                                                        marketProduct.row === cell.x && 
                                                                        marketProduct.column === cell.y && 
                                                                        cartProduct.product_id === marketProduct.product_id
                                                                    )
                                                                ).map(product => product.product_name_en).join('<br/>')
                                                                }
                                                            />
                                                        ) : null;
                                                        })
                                                    }
                                                    <Tooltip id={`info-${i}-${j}`} className='z-10'/>
                                                    { zonePath.length > 0 && <Path 
                                                    path={zonePath} 
                                                    currentRow={i} 
                                                    currentCol={j} 
                                                    waypoints={zoneWaypoints.filter(([pointRow, pointCol]) => { 
                                                        return (Math.abs(pointRow - i) === 1 && pointCol === j) || (Math.abs(pointCol - j) === 1 && pointRow === i);
                                                    })} 
                                                    scale={scale}
                                                    />}
                                                </React.Fragment>}
                                            </div>
                                        );
                                    })
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );     
};