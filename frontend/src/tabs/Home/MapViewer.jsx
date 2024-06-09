import { useEffect, useMemo, useState } from 'react';
import LayoutViewer from './LayoutViewer';
import ShoppingCart from './ShoppingCart';
import { findProducts } from '../../helper/findProducts';
import { MapViewerContext } from '../../context/MapViewerContext';
import { colors } from './colors';
import { getLayoutIndex } from '../../helper/getLayoutIndex';

export default function MapViewer({ market_name, market_image_url, mapLayout, setMarket }) {
    const [shoppingCart, setShoppingCart] = useState({ cart_name : '' , products: [] });
    const [zoom, setZoom] = useState(1);

    const { layout, productsInMarket } = useMemo(() => {
      return { layout: mapLayout.map_layout, productsInMarket: findProducts(mapLayout.map_layout) };
    }, [mapLayout.map_layout]);

    const layoutIndex = useMemo(() => {
      return getLayoutIndex(layout);
    }, [layout]);

    // zoom effect on layout
    useEffect(() => {
      const handleWheel = (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
          const newZoom = zoom * (e.deltaY < 0 ? 1 + 0.1 : 1 - 0.1);
          setZoom(newZoom < 1 ? 1 : newZoom);
        }
      };

      const container = document.querySelector('#layoutViewer');
      if (container) {
        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
          container.removeEventListener('wheel', handleWheel);
        };
      }
    }, [zoom]); 

    return !layout ? null :(
      <MapViewerContext.Provider value={{ shoppingCart, layout, productsInMarket, colors, layoutIndex }}>
        <div className='flex w-full h-full'>
          <ShoppingCart setShoppingCart={setShoppingCart} removeMarket={typeof setMarket === 'function' ? () => setMarket(null) : null}/>
          <div className='flex flex-col items-center justify-center gap-[1%]'>
            <div className='flex justify-center items-center gap-[8%] w-1/4 h-[12%] bg-gray-custom rounded-xl border-[0.4svh] border-purple-custom shadow-md shadow-purple-custom'>
              { market_image_url && 
              <div className='flex items-center justify-center w-[3svw] h-[6svh]'>
                  <img draggable='false' alt='' src={market_image_url}/>
              </div>}
              <p className='text-3xl font-bold'>{market_name}</p>
            </div>
            <div className='min-w-[75svw] max-w-[75svw] flex content-center justify-center items-center text-center'>
              <LayoutViewer zoom={zoom}/>
            </div>
          </div>
        </div>
      </MapViewerContext.Provider>
    );
}