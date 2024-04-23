import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './Layout';
import Toolbar from './Toolbar';
import data from './data.json';

export default function MapEditor() {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [layout, setLayout] = useState(data);
  const ref = useRef(null);

  useEffect(() => {
    function updateSize() {
      setHeight(ref.current.clientHeight);
      setWidth(ref.current.clientWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [ref]);

  return (
     <DndProvider backend={HTML5Backend}>
     <div className='flex h-full w-full'>
        <div>
          <div className='bg-slate-700 w-[75vw] max-w-[75vw] h-full content-center justify-center text-center' ref={ref}>
            <Layout layout={layout} height={height} width={width} setLayout={setLayout}/>
          </div>
        </div>
        <Toolbar layout={layout}/>
     </div>
   </DndProvider>
  );
}