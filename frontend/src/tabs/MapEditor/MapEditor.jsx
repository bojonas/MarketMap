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

  const layoutCopy = JSON.parse(JSON.stringify(layout));
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='flex h-full w-full'>
        <div className='float-left w-fit h-fit p-5'>
          <IoMdSettings size={24} onClick={openModal} />
        </div>
        { layout 
        ? <div className='min-w-[75svw] max-w-[75svw] h-full flex content-center justify-center items-center text-center pr-16'>
            <Layout layout={layout} setLayout={setLayout}/>
          </div>
        : <div className='min-w-[75svw] max-w-[75svw] h-full flex content-center justify-center items-center text-center pr-16'></div> 
        }
        <Toolbar layout={layout}/>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Settings Modal"
        style={{
          content: {
            backgroundColor: '#242424',
            width: '50svw',
            height: '50svh',
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
          ? <div className='w-[80%] h-[80%] flex flex-col gap-5 content-center justify-center items-center text-center'>
            <div className='flex gap-2 justify-center items-center w-[70%]'>
                <button className='add_remove_button' onClick={() => setLayout(removeRow(layoutCopy, 'top'))}>-</button>
                <p className='border-2 border-white rounded-lg w-[50%]'>{layout.length}</p>
                <button className='add_remove_button' onClick={() => setLayout(addRow(layoutCopy, 'top'))}>+</button>
            </div>
            <div className='flex gap-2 justify-center items-center w-[70%]'>
                <button className='add_remove_button' onClick={() => setLayout(removeColumn(layoutCopy, 'left'))}>-</button>
                <p className='border-2 border-white rounded-lg w-[50%]'>{layout[0].length}</p>
                <button className='add_remove_button' onClick={() => setLayout(addColumn(layoutCopy, 'left'))}>+</button>
            </div>
          </div>
          : null }
        <button className='custom-button text-base w-[10%] h-[10%]' onClick={closeModal}>Close</button>
      </Modal>
   </DndProvider>
  );
}