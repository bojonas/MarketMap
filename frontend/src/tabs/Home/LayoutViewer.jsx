import React, { useRef, useEffect, useState, useContext } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';
import { MapViewerContext } from '../../context/MapViewerContext';
import { getLayoutIndex } from '../../helper/getLayoutIndex';
import { getWaypoints } from '../../helper/getWaypoints';
import { requestFindPath } from '../../requests/homeRequests';
import { isEqualArray } from '../../helper/isEqualArray';

export default function LayoutViewer({ zoom }) {
  const { shoppingCart, layout, productsInMarket, colors } = useContext(MapViewerContext);
  const [dimensions, setDimensions] = useState({ width: '75svw', height: '75svh' });
  const ref = useRef(null);
  const { width, height } = useAdjustScale(ref);
  const scale = Math.min(width/ layout[0].length, height / layout.length);
  const [path, setPath] = useState([]);

  useEffect(() => {
    //if (productsInMarket.length === 0 || shoppingCart.products.length === 0) return;

    const getPath = async () => {
      if (productsInMarket.length === 0 || shoppingCart.products.length === 0) return;

      const waypoints = getWaypoints(productsInMarket, shoppingCart);
      const start = [0, 0];
      const end = [layout.length-1, 1];
      const data = await requestFindPath(layout, start, end, waypoints);
      if (data) {
        data.unshift(start);
        setPath(data);
      }
    }
    getPath();
  }, [layout, productsInMarket, shoppingCart]);

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
                  <Path path={path} currentRow={i} currentCol={j} scale={scale}/>
                  { productsInMarket.filter(product => product.row === i && product.column === j).map(product => {
                    const shoppingCartProduct = shoppingCart.products.find(marketProduct => marketProduct.product_id === product.product_id);
                    return !shoppingCartProduct ? null : (
                    <div key={product.product_id} className='absolute top-1/2 left-1/2 rounded-full hover:cursor-pointer'
                      style={{ 
                        width: `${scale/2}px`, 
                        height: `${scale/2}px`,
                        backgroundColor: colors[getLayoutIndex(layout)[product.row.toString() + product.column.toString()]],
                        transform: 'translate(-50%, -50%)',
                    }}/>
                  );}
                  )}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Path({ path, currentRow, currentCol, scale }) {
  if (path.length === 0 || isEqualArray(path[0], [currentRow, currentCol])) return;
  const coordIndex = path.findIndex(([row, col]) => row === currentRow && col === currentCol);

  if (coordIndex === -1) {
    return null;
  }
  
  let orientation = 'horizontal';
  if (coordIndex < path.length - 1) {
    const nextCoord = path[coordIndex + 1];
    if (nextCoord[0] === currentRow) {
      orientation = 'horizontal';
    } else if (nextCoord[1] === currentCol) {
      orientation = 'vertical';
    }
  }

  // Check for corner case
  let cornerType = '';
  if (coordIndex > 0 && coordIndex < path.length - 1) {
    const prevCoord = path[coordIndex - 1];
    const nextCoord = path[coordIndex + 1];
    if (prevCoord[0] === currentRow && nextCoord[1] === currentCol) {
      cornerType = `${prevCoord[1] > currentCol ? 'left' : 'right'}-${nextCoord[0] > currentRow ? 'bottom' : 'top'}`;
    } else if (prevCoord[1] === currentCol && nextCoord[0] === currentRow) {
      cornerType = `${prevCoord[0] > currentRow ? 'top' : 'bottom'}-${nextCoord[1] > currentCol ? 'right' : 'left'}`;
    }
  }
  
  if (!cornerType) return (
    <div className={`z-20 absolute top-1/2 left-1/2 bg-purple-custom`} 
      style={{ 
        width: orientation === 'horizontal' ? `${scale}px` : `${scale/10}px`,
        height: orientation === 'vertical' ? `${scale}px` : `${scale/10}px`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );

  let horizontalStyle = '';
  let verticalStyle = '';
  if (['top-right', 'left-bottom'].includes(cornerType)) {
    horizontalStyle = 'translate(-0%, -50%)';
    verticalStyle = 'translate(-50%, -0%)';
  }
  if (['top-left', 'left-top', 'bottom-left', 'right-top'].includes(cornerType)) {
    horizontalStyle = 'translate(-100%, -50%)';
    verticalStyle = 'translate(-50%, -100%)';
  }
  if (['right-bottom'].includes(cornerType)) {
    horizontalStyle = 'translate(-100%, -50%)';
    verticalStyle = 'translate(-50%, -0%)';
  }
  if (['bottom-right'].includes(cornerType)) {
    horizontalStyle = 'translate(-0%, -50%)';
    verticalStyle = 'translate(-50%, -100%)';
  }

  const horizontalDiv = (
    <div className={`z-20 absolute top-1/2 left-1/2 bg-purple-custom`} 
      style={{ 
        width: `${scale/2}px`,
        height: `${scale/10}px`,
        transform: horizontalStyle,
      }}
    />
  );
  
  const verticalDiv = (
    <div className={`z-20 absolute top-1/2 left-1/2 bg-purple-custom`} 
      style={{ 
        width: `${scale/10}px`,
        height: `${scale/2}px`,
        transform: verticalStyle,
      }}
    />
  );
  
  return (
    <div>
      {horizontalDiv}
      {verticalDiv}
    </div>
  );  
}