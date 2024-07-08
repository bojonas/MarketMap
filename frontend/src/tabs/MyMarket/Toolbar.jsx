import React, { useContext, useState } from 'react';
import SearchBar from "../../atoms/SearchBar";
import DraggableImage from '../../atoms/DraggableImage';
import { MapLayout } from './classes/MapLayout';
import { requestDeleteMarketZones, requestUpdateMapLayout, requestUpdateMarketZones } from '../../requests/myMarketRequests';
import { MyMarketContext } from '../../context/MyMarketContext';
import { checkChanges } from './checkChanges';
import { IoArrowBack } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";
import { SlFrame } from "react-icons/sl";
import { FaTrashCan } from "react-icons/fa6";
import { MapEditorContext } from '../../context/MapEditorContext';
import { titleCase } from '../../helper/titleCase';

export default function Toolbar({ setEditMode, editZone }) {
  const user_id = localStorage.getItem('user_id');
  const { mapLayout, setMapLayout, images, setSaveMessage} = useContext(MyMarketContext);
  const { layout, setLayout, editedZones, setEditedZones, addZone, setAddZone, setSave, setEditZone } = useContext(MapEditorContext);
  const [search, setSearch] = useState('');
  const filteredImages = Object.entries(images).filter(([type]) => type.toLowerCase().includes(search));

  const handleSave = async () => {
    setSave(true);
    if (addZone) return;

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
      ) return setSaveMessage('No Changes');

      newMapLayout.build(JSON.parse(JSON.stringify(layout)), JSON.parse(JSON.stringify(editedZones)));
      await requestUpdateMapLayout(user_id, newMapLayout.map_layout)
      setSaveMessage(await requestUpdateMarketZones(user_id, [zone]));
      return setMapLayout(newMapLayout);
    } 

    if (checkChanges(layout, mapLayout.map_layout)) {
      setEditMode(false);
      return setSaveMessage('No Changes');
    }

    const zonesToUpdate = [];
    for (const zone of oldZones) {
      const editedZone = editedZones.find(z => z.zone_id === zone.zone_id);
      if (
        editedZone &&
        checkChanges(zone.zone_layout, editedZone.zone_layout) && 
        zone.zone_name.trim() === editedZone.zone_name && 
        zone.zone_position.row === editedZone.zone_position.row &&
        zone.zone_position.column === editedZone.zone_position.column && 
        zone.zone_color === editedZone.zone_color
      ) continue;
      zonesToUpdate.push(editedZone)
    }

    const zonesToDelete = [];
    for (const zone of oldZones) {
      if (!editedZones.find(z => z.zone_id === zone.zone_id)) zonesToDelete.push(zone);
    }    

    newMapLayout.build(layout, editedZones);
    if (zonesToUpdate.length) await requestUpdateMarketZones(user_id, zonesToUpdate);
    if (zonesToDelete.length) await requestDeleteMarketZones(user_id, zonesToDelete.map(zone => zone.zone_id));

    setSaveMessage(await requestUpdateMapLayout(user_id, newMapLayout.map_layout));
    setEditMode(false);
    return setMapLayout(newMapLayout);
  }

  const deleteZone = async (zone) => {
    if (!zone) return;

    const newMapLayout = new MapLayout(layout.length, layout[0].length);
    newMapLayout.build(layout, editedZones);
    newMapLayout.removeZone(zone.zone_id);

    setLayout(newMapLayout.map_layout);
    setEditedZones(Array.from(newMapLayout.zones.values()));
    setEditZone(null);
  }

  return (
    <div className='flex flex-col items-center text-center w-full h-full bg-primary gap-[5%]'>
      <SearchBar onSearch={setSearch} placeholder={'Search items...'} contrast='purple'/>
      <div className='bg-gray-custom flex flex-col items-center text-center h-full rounded-lg'>
        <div className='w-[15svw] h-[55svh] rounded-lg p-[5%]'>
          <div className='w-full grid grid-cols-3 overflow-y-scroll text-center'>
            {filteredImages.map(([type, source], index) => (
              <div key={index} className='bg-offwhite w-[4svw] h-[8svh] flex flex-col items-center rounded-lg border-[0.4svh] border-gray-custom pb-[10%] pr-[3%] pl-[3%]'> 
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
      { !addZone && <div className='w-full h-full flex gap-[5%] items-center justify-center content-center'>
          <div onClick={() => setAddZone(true)} className='custom-button p-[4%] bg-darkgray-custom border-darkgray-custom border-[0.3svh] border-secondary-hover h-[6svh] text-[2.2svh] cursor-pointer'>
            <SlFrame size={20}/>
            <p className='ml-[0.5svw]'>Add Zone</p>
          </div>
          { typeof editZone === 'number' && <div onClick={() => deleteZone(editedZones.find(zone => zone.zone_id === editZone))} className='custom-button gap-[10%] bg-offwhite border-offwhite border-secondary-hover text-black h-[5.5svh] text-[2.2svh] cursor-pointer'>
            <FaTrashCan size={25}/>
            <p>Delete</p>
          </div>}
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