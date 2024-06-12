import React, { useEffect, useMemo, useState } from 'react';
import LayoutViewer from './LayoutViewer';
import ShoppingCart from './ShoppingCart';
import ZoneViewer from './ZoneViewer';
import { findProducts } from '../../helper/findProducts';
import { MapViewerContext } from '../../context/MapViewerContext';
import { colors } from './colors';
import { getLayoutIndex } from '../../helper/getLayoutIndex';
import { getWaypoints } from '../../helper/getWaypoints';
import { requestFindPath } from '../../requests/homeRequests';

export default function MapViewer({ market_name, market_image_url, mapLayout, setMarket, borderCells, images }) {
  const [shoppingCart, setShoppingCart] = useState({ cart_name : '' , products: [] });
  const [viewZone, setViewZone] = useState(null);
  const [showPath, setShowPath] = useState(false);
  const [path, setPath] = useState([]);

  const [zoom, setZoom] = useState(1);

  const { layout, productsInMarket } = useMemo(() => {
    return { layout: mapLayout.map_layout, productsInMarket: findProducts(mapLayout.map_layout) };
  }, [mapLayout.map_layout]);

  const layoutIndex = useMemo(() => {
    return getLayoutIndex(layout);
  }, [layout]);

  const waypoints = useMemo(() => {
    return productsInMarket.length !== 0 || shoppingCart.products.length !== 0 ? getWaypoints(productsInMarket, shoppingCart) : [];
  }, [productsInMarket, shoppingCart]);
  
  useEffect(() => {
    if (!showPath) return;
    const getPath = async () => {
      const data = await requestFindPath(layout, [], [], waypoints);
      if (!data) return;
      setPath(data);
    }
    getPath();
  }, [showPath, layout, waypoints])

  const handlePath = () => {
    if (showPath) setPath([]);
    setShowPath(prev => !prev);
  }

  const contextValue = useMemo(() => (
    {
      shoppingCart, 
      layout, 
      productsInMarket, 
      colors, 
      layoutIndex, 
      borderCells, 
      viewZone, 
      setViewZone, 
      images, 
      path,
      waypoints
    }
  ), [shoppingCart, layout, productsInMarket, layoutIndex, borderCells, viewZone, images, path, waypoints]);

  // zoom effect on layout
  useEffect(() => {
    const handleWheel = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const newZoom = zoom * (e.deltaY < 0 ? 1 + 0.1 : 1 - 0.1);
      setZoom(newZoom < 1 ? 1 : newZoom);
    };
  
    const container = document.querySelector(typeof viewZone === 'number' ? '#viewZone' : '#viewLayout');
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, viewZone]);

  return !layout ? null :(
    <MapViewerContext.Provider value={contextValue}>
      <div className='flex w-full h-full'>
        <ShoppingCart setShoppingCart={setShoppingCart} removeMarket={typeof setMarket === 'function' ? () => setMarket(null) : null} handlePath={handlePath}/>
          <div className='flex flex-col items-center justify-center gap-[1%]'>
            { typeof viewZone === 'number' ? <ZoneViewer zone={mapLayout.getZone(viewZone)} zoom={zoom}/> 
              : <React.Fragment>
                <div className='flex justify-center items-center gap-[8%] w-1/4 h-[12%] bg-gray-custom rounded-xl border-[0.4svh] border-purple-custom shadow-md shadow-purple-custom'>
                { market_image_url && 
                <div className='flex items-center justify-center w-[3svw] h-[6svh]'>
                    <img draggable='false' alt='' src={market_image_url}/>
                </div>}
                  <p className='text-[4svh] font-bold'>{market_name}</p>
                </div>
                <div className='min-w-[75svw] max-w-[75svw] flex content-center justify-center items-center text-center'>
                  <LayoutViewer zoom={zoom}/>
                </div>
              </React.Fragment>
            }
          </div>
      </div>
    </MapViewerContext.Provider>
  );
}