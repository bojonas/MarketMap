import { useEffect, useState } from "react";
import { requestGetMapViewers } from "../../requests/homeRequests";
import LayoutViewer from "./LayoutViewer";

export default function MapViewer({ market_id }) {
    const [layout, setLayout] = useState(null);
    const [zoom, setZoom] = useState(1);

    // get map for market
    useEffect(() => {
        const getLayout = async () => {
          const data = await requestGetMapViewers(market_id);
          if (data) setLayout(data);
        }
        getLayout();
      }, [market_id]);

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

    return (
        <div>
       { layout 
        ? <div className='min-w-[70svw] max-w-[70svw] flex content-center justify-center items-center text-center'>
          <LayoutViewer layout={layout} setLayout={setLayout} zoom={zoom}/>
        </div>
        : <div className='min-w-[70svw] max-w-[70svw] flex content-center justify-center items-center text-center'></div> 
      }
      </div>
    );
}