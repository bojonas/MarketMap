import React, { useContext, useState } from 'react';
import SearchBar from "../../atoms/SearchBar";
import DraggableImage from '../../atoms/DraggableImage';
import { MapLayout } from './classes/MapLayout';
import { requestUpdateMapLayout, requestUpdateMarketZones } from '../../requests/myMarketRequests';
import { MyMarketContext } from '../../context/MyMarketContext';
import { checkChanges } from './checkChanges';
import { IoArrowBack } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";
import { SlFrame } from "react-icons/sl";
import { MapEditorContext } from '../../context/MapEditorContext';
import { titleCase } from '../../helper/titleCase';

export default function Toolbar({ setEditMode, setEditZone, editZone }) {
  const user_id = localStorage.getItem('user_id');
  const { mapLayout, setMapLayout, images } = useContext(MyMarketContext);
  const { layout, editedZones, addZone, setAddZone } = useContext(MapEditorContext);
  const [search, setSearch] = useState('');
  const filteredImages = Object.entries(images).filter(([type]) => type.toLowerCase().includes(search));

  const handleSave = async () => {
    // copy mapLayout
    const newMapLayout = new MapLayout(layout.length, layout[0].length);
    const oldZones = Array.from(mapLayout.zones.values());

    if (typeof editZone === 'number') {
      setEditZone(null);
      const zone = editedZones.find(z => z.zone_id === editZone);
      const oldZone = oldZones.find(z => z.zone_id === editZone);
      if (
        checkChanges(zone.zone_layout, oldZone.zone_layout) && 
        zone.zone_name.trim() === oldZone.zone_name && 
        zone.zone_position.row === oldZone.zone_position.row &&
        zone.zone_position.column === oldZone.zone_position.column && 
        zone.zone_color === oldZone.zone_color
      ) return alert('No Changes');
      newMapLayout.build(layout, editedZones);
      await requestUpdateMapLayout(user_id, newMapLayout.map_layout)
      alert(await requestUpdateMarketZones(user_id, [zone]));
      return setMapLayout(newMapLayout);
    } 

    if (checkChanges(layout, mapLayout.map_layout)) {
      setEditMode(false);
      return alert('No Changes');
    }

    const zonesToUpdate = [];
    for (const zone of oldZones) {
      const editedZone = editedZones.find(z => z.zone_id === zone.zone_id);
      if (
        checkChanges(zone.zone_layout, editedZone.zone_layout) && 
        zone.zone_name.trim() === editedZone.zone_name && 
        zone.zone_position.row === editedZone.zone_position.row &&
        zone.zone_position.column === editedZone.zone_position.column && 
        zone.zone_color === editedZone.zone_color
      ) continue;
      zonesToUpdate.push(editedZone)
    }

    newMapLayout.build(layout, editedZones);
    if (zonesToUpdate.length > 0) await requestUpdateMarketZones(user_id, zonesToUpdate)
    alert(await requestUpdateMapLayout(user_id, newMapLayout.map_layout));
    setEditMode(false);
    return setMapLayout(newMapLayout);
  }

  return (
    <div className='flex flex-col items-center text-center w-full h-full bg-primary gap-[5%]'>
      <SearchBar onSearch={setSearch} placeholder={'Search items...'} contrast='purple'/>
      <div className='bg-gray-custom flex flex-col items-center text-center h-full rounded-lg'>
        <div className='w-[15svw] h-[55svh] rounded-lg p-[5%]'>
          <div className='w-full grid grid-cols-3 overflow-y-scroll text-center'>
            {filteredImages.map(([type, source], index) => (
              <div key={index} className='bg-offwhite w-fit h-fit flex flex-col items-center rounded-lg border-[0.5svh] border-gray-custom pb-[10%] pr-[3%] pl-[3%]'> 
                <span className='text-black text-[0.6svw] overflow-auto whitespace-nowrap text-overflow-ellipsis'>{titleCase(type).replace('_', ' ')}</span>
                <div className='w-3/4 h-fit rounded-lg hover:border-[0.5svh] border-secondary-hover cursor-pointer'
                  style={{ boxShadow: '0 5px 2px -1px #303030' }}>
                  <DraggableImage alt={type} source={source} duplicate={true}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      { !addZone && <div onClick={() => setAddZone(true)} className='flex items-center justify-center rounded-full p-[4%] bg-darkgray-custom border-darkgray-custom border-[0.3svh] border-secondary-hover h-[6svh] text-[2.2svh] cursor-pointer'>
          <SlFrame size={20}/>
          <p className='ml-[0.5svw]'>Add Zone</p>
        </div>
      }
      <div className='w-full h-full flex gap-[5%] items-center justify-center content-center pb-[5%]'>
        <div onClick={() => addZone ? setAddZone(false) : typeof editZone === 'number' ? setEditZone(null) : setEditMode(false)} className='custom-button gap-[10%] bg-darkgray-custom border-darkgray-custom border-secondary-hover h-[5.5svh] text-[2.2svh] cursor-pointer'>
          <IoArrowBack size={25}/>
          <p>Back</p>
        </div>
        <div onClick={handleSave} className='custom-button gap-[10%] bg-offwhite border-offwhite border-secondary-hover text-black h-[5.5svh] text-[2.2svh] cursor-pointer'>
          <FaRegSave size={25}/>
          <p>Save</p>
        </div>
      </div>
    </div>
  );  
}