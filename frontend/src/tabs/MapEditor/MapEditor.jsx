import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './Layout';
import Toolbar from './Toolbar';
import { requestGetMapLayout } from '../../requests/mapEditorRequests';

export default function MapEditor() {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    const getLayout = async () => {
      const data = await requestGetMapLayout(2);
      if (data) setLayout(data);
    }
    getLayout();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex h-full w-full'>
        <div>
          { layout 
          ? <div className='w-[80svw] max-w-[80svw] h-full flex content-center justify-center items-center text-center'>
              <Layout layout={layout} setLayout={setLayout}/>
            </div>
          : <div className='w-[80svw] max-w-[80svw] h-full flex content-center justify-center items-center text-center'></div> }
        </div>
        <Toolbar layout={layout}/>
      </div>
   </DndProvider>
  );
}
