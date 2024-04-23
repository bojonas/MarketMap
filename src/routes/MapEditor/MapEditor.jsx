import React, { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './Layout';
import Toolbar from './Toolbar';
import data from './data.json';
import { useAdjustScale } from '../../helper/useAdjustScale';

export default function MapEditor() {
  const [layout, setLayout] = useState(data);
  const ref = useRef(null);

  const { width, height } = useAdjustScale(ref);

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