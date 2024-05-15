import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import LayoutViewer from "./LayoutViewer";

export default function MapViewer() {
    const location = useLocation();
    const market = location.state.market;
    const layout = market.map_layout
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

        const container = document.querySelector('#layoutContainer');
        if (container) {
        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
        }
    }, [zoom, layout]);

    return !layout ? null :(
      <div className='flex w-full h-full items-center justify-center'>
        <div className='min-w-[70svw] max-w-[70svw] flex content-center justify-center items-center text-center'>
          <LayoutViewer layout={layout} zoom={zoom}/>
        </div>
      </div>
    );
}