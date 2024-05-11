import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './Layout';
import Toolbar from './Toolbar';
import { requestGetMapLayout } from '../../requests/mapEditorRequests';
import { IoMdSettings } from "react-icons/io";
import Modal from 'react-modal';
import { addRow, addColumn, removeRow, removeColumn } from '../../helper/editLayout'


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
        const zoomFactor = Math.max(layout.length, layout[0].length) > 40 ? 0.2 : 0.05; 
        const newZoom = zoom * (e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor);
        setZoom(newZoom);
      }
    };
  
    const container = document.querySelector('.flex.h-full.w-full.gap-5');
    container.addEventListener('wheel', handleWheel, { passive: false });
  
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, layout]);  
  

  const layoutCopy = JSON.parse(JSON.stringify(layout));
  return (
    <DndProvider backend={HTML5Backend}>
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
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Settings Modal"
        style={{
          content: {
            backgroundColor: '#171717',
            width: '40svw',
            height: '40svh',
            top: '15svh',
            display: 'flex',
            flexDirection: 'column',
            content: 'center',
            alignItems: 'center'
          },
          overlay: {
            backgroundColor: 'transparent'
          }
        }}
      >
        <h2>Settings</h2>
        { layout 
          ? <div className='w-[80%] h-[80%] flex flex-col gap-5 justify-center text-center'>
            <div className='flex gap-2 items-center w-[70%] ml-[10%]'>
                <p>Width:</p>
                <button className='add_remove_button' onClick={() => setLayout(removeColumn(layoutCopy))}>-</button>
                <p className='bg-gray-custom border-2 border-white rounded-lg w-[50%] shadow-md shadow-slate-700'>{layout[0].length}</p>
                <button className='add_remove_button' onClick={() => setLayout(addColumn(layoutCopy))}>+</button>
            </div>
            <div className='flex gap-2 items-center w-[70%] ml-[9%]'>
              <p>Height:</p>
                <button className='add_remove_button' onClick={() => setLayout(removeRow(layoutCopy))}>-</button>
                <p className='bg-gray-custom border-2 border-white rounded-lg w-[50%] shadow-md shadow-slate-700'>{layout.length}</p>
                <button className='add_remove_button' onClick={() => setLayout(addRow(layoutCopy))}>+</button>
            </div>
          </div>
          : null }
        <button className='custom-button text-base w-[15%] h-[15%] shadow-slate-700' onClick={closeModal}>Close</button>
      </Modal>
   </DndProvider>
  );
}