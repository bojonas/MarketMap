import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';
import { MapViewerContext } from '../../context/MapViewerContext';
import { getWaypoints } from '../../helper/getWaypoints';
import { requestFindPath } from '../../requests/homeRequests';
import Path from '../../atoms/Path';

export default function LayoutViewer({ zoom }) {
  const { shoppingCart, layout, productsInMarket, colors, layoutIndex } = useContext(MapViewerContext);
  const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
  const ref = useRef(null);
  const { width, height } = useAdjustScale(ref);
  const scale = Math.min(width/ layout[0].length, height / layout.length);
  const [path, setPath] = useState([]);

  const waypoints = useMemo(() => {
    return productsInMarket.length !== 0 || shoppingCart.products.length !== 0 ? getWaypoints(productsInMarket, shoppingCart) : [];
  }, [productsInMarket, shoppingCart]);
  
  useEffect(() => {
    if (productsInMarket.length === 0 || shoppingCart.products.length === 0) return;
    const getPath = async () => {
      const start = [layout.length-1, 1];
      const end = [1, 1];
      const data = await requestFindPath(layout, start, end, waypoints);
      if (data) {
        data.unshift(start);
        setPath(data);
      }
    }
    getPath();
  }, [layout, productsInMarket, shoppingCart, waypoints]);

  // fix scrollbars after zoom
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
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div ref={ref} className='border-[1svh] border-darkgray-custom overflow-scroll' style={dimensions}>
          <div id='layoutViewer' className='grid w-fit h-fit' 
            style={{ 
              gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
              gridTemplateRows: `repeat(${layout.length}, ${scale}px)`, 
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}>
            {layout.map((row, i) => (
              row.map((cell, j) => (
                <div key={`cell-${i}-${j}`} className='relative'>
                  <CellViewer
                    key={cell['coordinates']} 
                    type={cell['type']} 
                    cellStyle={{ 
                      height: `${scale}px`, 
                      width: `${scale}px`, 
                      border: `${scale/10}px solid #171717`,
                      borderRadius: `${scale/5}px`,
                      transform: `rotate(${layout[i][j]['rotation']}deg)`,
                    }}
                  />
                  { productsInMarket.filter(product => product.row === i && product.column === j).map(product => {
                    const shoppingCartProduct = shoppingCart.products.find(marketProduct => marketProduct.product_id === product.product_id);
                    return !shoppingCartProduct ? null : (
                      <React.Fragment key={product.product_id}>
                        <div className='absolute top-1/2 left-1/2 rounded-full hover:cursor-pointer'
                          style={{ 
                            width: `${scale/2}px`, 
                            height: `${scale/2}px`,
                            backgroundColor: colors[layoutIndex[product.row.toString() + product.column.toString()]],
                            transform: 'translate(-50%, -50%)',
                          }}
                          data-tooltip-id={`info-${i}-${j}`} 
                          data-tooltip-html={product.product_id}
                        />
                        <Tooltip id={`info-${i}-${j}`} place='top'/>
                      </React.Fragment>
                    )}
                  )}
                  <Path 
                    path={path} 
                    currentRow={i} 
                    currentCol={j} 
                    waypoints={waypoints.filter(([pointRow, pointCol]) => { 
                      return (Math.abs(pointRow - i) === 1 && pointCol === j) || (Math.abs(pointCol - j) === 1 && pointRow === i);
                    })} 
                    scale={scale}
                  />
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}