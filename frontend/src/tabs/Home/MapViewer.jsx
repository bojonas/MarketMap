import { useEffect, useState } from 'react';
import LayoutViewer from './LayoutViewer';
import ShoppingCart from './ShoppingCart';
import { findProducts } from '../../helper/findProducts';
import { MapViewerContext } from '../../DimensionContext';
import { colors } from './colors';

export default function MapViewer({ market, setMarket }) {
    const layout = market.map_layout
    const [shoppingCart, setShoppingCart] = useState([]);
    const productsInMarket = findProducts(layout);
    const [zoom, setZoom] = useState(1);

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
    }, [zoom, layout]); 

    return !layout ? null :(
      <MapViewerContext.Provider value={{ shoppingCart, layout, productsInMarket, colors }}>
        <div className='flex w-full h-full'>
          <ShoppingCart setShoppingCart={setShoppingCart} removeMarket={typeof setMarket === 'function' ? () => setMarket(null) : null}/>
          <div className='flex flex-col items-center justify-center'>
            <p className='text-3xl font-bold mb-[3svh]'>{market.market_name}</p>
            <div className='min-w-[75svw] max-w-[75svw] flex content-center justify-center items-center text-center'>
              <LayoutViewer zoom={zoom}/>
            </div>
          </div>
        </div>
      </MapViewerContext.Provider>
    );
}