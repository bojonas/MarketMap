import React, { useState, useEffect, useContext } from 'react';
import Layout from './Layout';
import Toolbar from './Toolbar';
import { IoMdSettings } from "react-icons/io";
import CustomModal from './CustomModal';
import { MapEditorContext } from '../../DimensionContext';
import { MyMarketContext } from '../../DimensionContext';
import { useChangeDragMode } from '../../hooks/useChangeDragMode';

export default function MapEditor({ setEditMode }) {
  const market = useContext(MyMarketContext);
  const [layout, setLayout] = useState(market ? JSON.parse(JSON.stringify(market.map_layout)) : null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  // tracking for edit modes
  const [duplicateCells, setDuplicateCells] = useState([]);
  const [duplicateMode, setDuplicateMode] = useState(false);
  const [deleteCells, setDeleteCells] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [overruledDuplicate, setOverruledDuplicate] = useState(false);
  const [overruledDelete, setOverruledDelete] = useState(false);
  useChangeDragMode(setDuplicateMode, setDeleteMode, overruledDuplicate, overruledDelete);

  // settings window
  const openModal = () => {
    setModalIsOpen(true);
  }
  const closeModal = () => {
    setModalIsOpen(false);
  }

  // change Mode
  const changeDuplicateMode = () => {
    setDuplicateMode(prevValue => !prevValue);
    setOverruledDuplicate(prevValue => !prevValue);
    setDeleteMode(false);
    setOverruledDelete(false);
  }

  const changeDeleteMode = () => {
    setDeleteMode(prevValue => !prevValue)
    setOverruledDelete(prevValue => !prevValue);
    setDuplicateMode(false);
    setOverruledDuplicate(false);
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
  
  return !layout ? (<div className='w-full h-full'></div>) : (
    <MapEditorContext.Provider value={{ duplicateCells, setDuplicateCells, deleteCells, setDeleteCells, duplicateMode, deleteMode }}>
      <div className='flex h-full w-full'>
        <Toolbar layout={layout} setEditMode={setEditMode}/>
        <div className='min-w-[75svw] max-w-[75svw] flex flex-col content-center justify-center items-center text-center' 
          style={{cursor: duplicateMode ? 'cell' : deleteMode ? 'not-allowed' : 'auto' }}>
          <p className='text-3xl font-bold mb-[3svh]'>{market.market_name}</p>
          <Layout layout={layout} setLayout={setLayout} zoom={zoom}/>
        </div>
        <div onClick={openModal} className='flex absolute h-fit w-fit p-[1svh] right-[2.5svw] top-[2.2svw] hover:bg-gray-custom rounded-full cursor-pointer hover:text-purple-custom'>
          <IoMdSettings size={24}/>
          <p className='ml-[0.5svw]'>Settings</p>
        </div>
        { modalIsOpen && <CustomModal 
          layout={layout} 
          setLayout={setLayout} 
          modalIsOpen={modalIsOpen} 
          closeModal={closeModal} 
          changeDuplicateMode={changeDuplicateMode} 
          changeDeleteMode={changeDeleteMode}/>}
      </div>
    </MapEditorContext.Provider>
  );
}