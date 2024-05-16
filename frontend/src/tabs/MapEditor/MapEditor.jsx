import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Toolbar from './Toolbar';
import { requestGetMapLayout } from '../../requests/mapEditorRequests';
import { IoMdSettings } from "react-icons/io";
import CustomModal from './CustomModal';
import { DimensionContext } from '../../DimensionContext';
import { useChangeDragMode } from '../../helper/useChangeDragMode';

export default function MapEditor() {
  // key tracking for edit modes
  const [trackedCells, setTrackedCells] = useState([]);
  const [duplicateMode, setDuplicateMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [overruledDuplicate, setOverruledDuplicate] = useState(false);
  const [overruledDelete, setOverruledDelete] = useState(false);
  useChangeDragMode(setDuplicateMode, setDeleteMode, overruledDuplicate, overruledDelete);

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

  // change Mode
  const changeDuplicateMode = () => {
    setOverruledDuplicate(true);
    setDeleteMode(false);
    setDuplicateMode(prevValue => !prevValue)
  }

  const changeDeleteMode = () => {
    setOverruledDelete(true);
    setDuplicateMode(false);
    setDeleteMode(prevValue => !prevValue)
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
    <DimensionContext.Provider value={{ trackedCells, setTrackedCells, duplicateMode, deleteMode }}>
      <div className='flex h-full w-full gap-5'>
        <div className='float-left h-fit w-fit p-[1svh] ml-[1svw] mt-[2svh] hover:bg-gray-custom rounded-3xl' onClick={openModal}>
          <IoMdSettings size={24}/>
        </div>
        { layout 
        ? <div className='min-w-[70svw] max-w-[70svw] flex content-center justify-center items-center text-center' 
          style={{cursor: duplicateMode ? 'cell' : deleteMode ? 'not-allowed' : 'auto' }}>
            <Layout layout={layout} setLayout={setLayout} zoom={zoom}/>
          </div>
        : <div className='min-w-[70svw] max-w-[70svw] flex content-center justify-center items-center text-center'></div> 
        }
        <Toolbar layout={layout}/>
        <CustomModal 
          layout={layoutCopy} 
          setLayout={setLayout} 
          modalIsOpen={modalIsOpen} 
          closeModal={closeModal} 
          changeDuplicateMode={changeDuplicateMode} 
          changeDeleteMode={changeDeleteMode}/>
      </div>
    </DimensionContext.Provider>
  );
}