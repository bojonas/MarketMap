import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './Layout';
import Toolbar from './Toolbar';
import { requestGetMapLayout } from '../../requests/mapEditorRequests';

export default function MapEditor() {
  const [layout, setLayout] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLayout = async () => {
      const data = await requestGetMapLayout(2);
      setLayout(data);
      setIsLoading(false);
    }
    getLayout();
  }, []);

  return (
     <DndProvider backend={HTML5Backend}>
     <div className='flex h-full w-full'>
        <div>
          <div className='w-[80svw] max-w-[80svw] h-full flex content-center justify-center items-center text-center'>
            {isLoading ? 'Loading...' : <Layout layout={layout} setLayout={setLayout}/>}
          </div>
        </div>
        {isLoading ? 'Loading...' :  <Toolbar layout={layout}/>}
     </div>
   </DndProvider>
  );
}