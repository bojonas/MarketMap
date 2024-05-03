import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './Layout';
import Toolbar from './Toolbar';
import data from './data.json';

export default function MapEditor() {
  const [layout, setLayout] = useState(data);
  return (
     <DndProvider backend={HTML5Backend}>
     <div className='flex h-full w-full'>
        <div>
          <div className='w-[80svw] max-w-[80svw] h-full flex content-center justify-center items-center text-center'>
            <Layout layout={layout} setLayout={setLayout}/>
          </div>
        </div>
        <Toolbar layout={layout} />
     </div>
   </DndProvider>
  );
}