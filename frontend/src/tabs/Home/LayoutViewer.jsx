import React, { useRef, useEffect, useState, useContext } from 'react';
import { Tooltip } from 'react-tooltip';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';
import { MapViewerContext } from '../../context/MapViewerContext';
import Path from '../../atoms/Path';

export default function LayoutViewer({ zoom }) {
  const { shoppingCart, layout, productsInMarket, colors, layoutIndex, borderCells, setViewZone, images, path, waypoints } = useContext(MapViewerContext);
  const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
  const ref = useRef(null);
  const { width, height } = useAdjustScale(ref);
  const scale = Math.min(width/ layout[0].length, height / layout.length);

  // fix scrollbars after zoom
  useEffect(() => {
    if (ref.current) {
      const container = ref.current;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
      container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
    }
  }, [zoom, layout]);

  // update dimensions after initial render
  useEffect(() => {
    setDimensions({ width: 'fit-content', height: 'fit-content' });
  }, []);  

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div ref={ref} className='border-[1svh] border-darkgray-custom overflow-scroll' style={dimensions}>
          <div id='viewLayout' className='grid w-fit h-fit' 
            style={{ 
              gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
              gridTemplateRows: `repeat(${layout.length}, ${scale}px)`, 
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}>
            { layout.map((row, i) => (
              row.map((cell, j) => (
                <div key={`cell-${i}-${j}`} onClick={() => setViewZone(cell.zone_id)} className={`relative ${typeof cell.zone_id === 'number' ? 'cursor-pointer' : ''}`}>
                  <CellViewer
                    key={cell.y} 
                    type={cell.type} 
                    source={images[cell.type]}
                    cellStyle={{ 
                      height: `${scale}px`, 
                      width: `${scale}px`, 
                      transform: `rotate(${layout[i][j]['rotation']}deg)`,
                      border: `${scale/10}px solid #171717`,
                      borderRadius: `${scale/5}px`,
                      backgroundColor: borderCells.size && typeof cell.zone_id === 'number' ? `rgba(${borderCells.get(cell.zone_id).zone_color}, ${cell.type === 'empty' ? '0.3' : '0.8'})` : ''
                    }}
                  />
                  { productsInMarket.filter(product => product.row === i && product.column === j).flatMap(marketProduct => {
                      const shoppingCartProduct = shoppingCart.products.find(cartProduct => cartProduct.product_id === marketProduct.product_id);
                      return shoppingCartProduct ? (
                        <React.Fragment key={marketProduct.product_id}>
                          <div className='absolute top-1/2 left-1/2 rounded-full hover:cursor-pointer'
                            style={{ 
                              width: `${scale/2}px`, 
                              height: `${scale/2}px`,
                              backgroundColor: colors[layoutIndex[marketProduct.row.toString() + marketProduct.column.toString()]],
                              transform: 'translate(-50%, -50%)',
                            }}
                            data-tooltip-id={`info-${i}-${j}`} 
                            data-tooltip-html={
                              shoppingCart.products.filter(cartProduct => 
                                productsInMarket.some(marketProduct => 
                                    marketProduct.row === i && 
                                    marketProduct.column === j && 
                                    cartProduct.product_id === marketProduct.product_id
                                )
                              ).map(product => product.product_name_en).join('<br/>')
                            }
                          />
                        </React.Fragment>
                      ) : null;
                    })
                  }
                  <Tooltip id={`info-${i}-${j}`} className='z-10'/>
                  { path.length > 0 && <Path 
                    path={path} 
                    currentRow={i} 
                    currentCol={j} 
                    waypoints={waypoints.filter(([pointRow, pointCol]) => { 
                      return (Math.abs(pointRow - i) === 1 && pointCol === j) || (Math.abs(pointCol - j) === 1 && pointRow === i);
                    })} 
                    scale={scale}
                  />}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}