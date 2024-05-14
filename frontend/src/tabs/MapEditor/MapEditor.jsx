import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Toolbar from './Toolbar';
import { requestGetMapLayout } from '../../requests/mapEditorRequests';
import { IoMdSettings } from "react-icons/io";
import CustomModal from '../../helper/CustomModal';

export default function MapEditor() {
  const [layout, setLayout] = useState(null);
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
  
  const layoutCopy = JSON.parse(JSON.stringify(layout));
  return (
    <div className='flex h-full w-full gap-5'>
      <div className='float-left h-fit w-fit p-[1svh] ml-[1svw] mt-[2svh] hover:bg-gray-custom rounded-3xl' onClick={openModal}>
        <IoMdSettings size={24}/>
      </div>
      { layout 
      ? <div className='min-w-[70svw] max-w-[70svw] flex content-center justify-center items-center text-center'>
          <Layout layout={layout} setLayout={setLayout} zoom={zoom}/>
        </div>
      : <div className='min-w-[70svw] max-w-[70svw] flex content-center justify-center items-center text-center'></div> 
      }
      <Toolbar layout={layout}/>
      <CustomModal layout={layoutCopy} setLayout={setLayout} modalIsOpen={modalIsOpen} closeModal={closeModal}/>
    </div>
  );
}