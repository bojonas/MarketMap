import React, { useState, useEffect, useContext, useMemo } from 'react';
import Toolbar from './Toolbar';
import LayoutEditor from './LayoutEditor';
import ZoneEditor from './ZoneEditor';
import { IoMdSettings } from "react-icons/io";
import CustomModal from './CustomModal';
import ProductModal from './ProductModal';
import { MapEditorContext } from '../../context/MapEditorContext';
import { MyMarketContext } from '../../context/MyMarketContext';
import { useChangeDragMode } from '../../hooks/useChangeDragMode';
import { requestGetProducts } from '../../requests/homeRequests';
import ZoneCreator from './ZoneCreator';

export default function MapEditor({ setEditMode }) {
  const { market, mapLayout } = useContext(MyMarketContext);
  const [layout, setLayout] = useState(JSON.parse(JSON.stringify(mapLayout.map_layout)));
  const [editedZones, setEditedZones] = useState(JSON.parse(JSON.stringify(Array.from(mapLayout.zones.values()))));

  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const [openCell, setOpenCell] = useState(null);
  const [products, setProducts] = useState([]);
  const [editZone, setEditZone] = useState(null);
  const [addZone, setAddZone] = useState(false);
  const [save, setSave] = useState(false);

  // tracking for edit modes
  const [duplicateCells, setDuplicateCells] = useState([]);
  const [duplicateMode, setDuplicateMode] = useState(false);
  const [deleteCells, setDeleteCells] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [overruledDuplicate, setOverruledDuplicate] = useState(false);
  const [overruledDelete, setOverruledDelete] = useState(false);
  useChangeDragMode(setDuplicateMode, setDeleteMode, overruledDuplicate, overruledDelete);

  useEffect(() => {
    const getProducts = async () => {
      const data = await requestGetProducts();
      if (data) setProducts(data);
    }
    getProducts()
  }, [openCell]);

  const contextValue = useMemo(() => ({
    layout,
    setLayout,
    editedZones,
    setEditedZones,
    duplicateCells, 
    setDuplicateCells, 
    deleteCells, 
    setDeleteCells, 
    duplicateMode, 
    deleteMode, 
    openCell,
    setOpenCell,
    setEditZone,
    products,
    addZone,
    setAddZone,
    save, 
    setSave
  }), [duplicateCells, deleteCells, duplicateMode, deleteMode, openCell, editedZones, layout, products, addZone, save]);  

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

  return !layout ? (<div className='w-full h-full'></div>) : (
    <MapEditorContext.Provider value={contextValue}>
      <div className='flex h-full w-full'>
        <Toolbar setEditMode={setEditMode} editZone={editZone}/>
        <div className='flex flex-col items-center justify-center gap-[1%]' style={{ cursor: duplicateMode ? 'cell' : deleteMode ? 'not-allowed' : 'auto' }}>
          { addZone 
            ? <div className='w-[75svw] h-full'>
              <ZoneCreator/>
            </div>
            : typeof editZone === 'number' ? <ZoneEditor zone={editedZones.find(zone => zone.zone_id === editZone)} setEditedZones={setEditedZones}/>
              : <React.Fragment>
                <div className='flex justify-center items-center max-w-1/2 gap-[2%] p-[1.5%] bg-gray-custom rounded-xl border-[0.4svh] border-secondary shadow-md shadow-secondary'>
                  { market.market_image_url && 
                  <div className='flex items-center justify-center w-[3svw] h-[6svh]'>
                      <img draggable='false' alt='' src={market.market_image_url}/>
                  </div>}
                  <p className='w-full text-[4svh] font-bold overflow-hidden whitespace-nowrap text-ellipsis max-w-full'>{market.market_name}</p>
                </div>
                <div className='min-w-[75svw] max-w-[75svw] flex content-center justify-center items-center text-center'>
                  <LayoutEditor/>
                </div>
                <div onClick={() => setSettingsIsOpen(true)} className='absolute flex right-[6.5svw] top-[3svw] text-primary-hover cursor-pointer'>
                  <IoMdSettings size={24}/>
                  <p className='ml-[0.5svw]'>Settings</p>
                </div>
                <CustomModal 
                  modalIsOpen={settingsIsOpen} 
                  closeModal={() => setSettingsIsOpen(false)} 
                  changeDuplicateMode={changeDuplicateMode} 
                  changeDeleteMode={changeDeleteMode}/>
                <ProductModal 
                  openCell={openCell} 
                  closeCell={() => setOpenCell(null)}
                  products={products}/>
              </React.Fragment>
          }
        </div>
      </div>
    </MapEditorContext.Provider>
  );
}