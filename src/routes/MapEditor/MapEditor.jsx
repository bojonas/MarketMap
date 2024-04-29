import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './Layout';
import Toolbar from './Toolbar';
import data from './data.json';

export default function MapEditor({ width, height }) {
  const [layout, setLayout] = useState(data);
  return (
     <DndProvider backend={HTML5Backend}>
     <div className='flex h-full w-full'>
        <div>
          <div className='bg-black w-[75vw] max-w-[75vw] h-full content-center justify-center text-center'>
            <Layout layout={layout} width={width/1.2} height={height/1.2} setLayout={setLayout}/>
          </div>
        </div>
        <Toolbar layout={layout} width={width/1.1} height={height/1.1}/>
     </div>
   </DndProvider>
  );
}