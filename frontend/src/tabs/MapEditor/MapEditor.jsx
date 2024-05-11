import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './Layout';
import Toolbar from './Toolbar';
import { requestGetMapLayout } from '../../requests/mapEditorRequests';
import { IoMdSettings } from "react-icons/io";
import CustomModal from '../../helper/CustomModal';

export default function MapEditor() {
  const [layout, setLayout] = useState(null);
  const [scale, setScale] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const getLayout = async () => {
      const data = await requestGetMapLayout(2);
      if (data) setLayout(data);
    }
    getLayout();
  }, []);

  // settings window
  const openModal = () => {
    setModalIsOpen(true);
  }
  const closeModal = () => {
    setModalIsOpen(false);
  }

  // zoom effect on layout
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomFactor = Math.max(layout.length, layout[0].length) > 40 ? 0.2 : 0.05; 
        const newZoom = zoom * (e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor);
        setZoom(newZoom);
      }
    };
  
    const container = document.querySelector('#zoomContainer');
    container.addEventListener('wheel', handleWheel, { passive: false });
  
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, layout]);  
  
  const layoutCopy = JSON.parse(JSON.stringify(layout));
  return (
    <DndProvider backend={HTML5Backend}>
      <div id='zoomContainer' className='flex h-full w-full gap-5'>
        <div className='float-left h-fit w-fit p-[1svh] ml-[1svw] mt-[2svh] hover:bg-gray-custom rounded-3xl' onClick={openModal}>
          <IoMdSettings size={24}/>
        </div>
        { layout 
        ? <div className='min-w-[70svw] max-w-[70svw] flex content-center justify-center items-center text-center'>
            <Layout layout={layout} setLayout={setLayout} setScale={setScale} zoom={zoom}/>
          </div>
        : <div className='min-w-[70svw] max-w-[70svw] flex content-center justify-center items-center text-center'></div> 
        }
        <Toolbar layout={layout} layoutScale={scale*zoom}/>
        <CustomModal layout={layoutCopy} setLayout={setLayout} modalIsOpen={modalIsOpen} closeModal={closeModal}/>
      </div>
  </DndProvider>
  );
}