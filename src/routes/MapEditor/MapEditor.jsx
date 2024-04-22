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
    setHeight(ref.current.clientHeight);
    setWidth(ref.current.clientWidth);
  }, []);

  return (
     <DndProvider backend={HTML5Backend}>
     <div className='flex h-full bg-slate-900'>
        <div>
          <div className='bg-slate-700 w-[75vw] max-w-[75vw] h-[90vh] max-h-[90vh] content-center justify-center text-center p-1' ref={ref}>
            <Layout layout={layout} height={height} width={width} setLayout={setLayout}/>
          </div>
        </div>
        <Toolbar layout={layout}/>
     </div>
   </DndProvider>
  );
}