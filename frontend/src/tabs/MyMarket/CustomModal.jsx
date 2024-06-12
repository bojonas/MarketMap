import Modal from 'react-modal';
import { useContext, useState, useEffect } from 'react';
import { MapEditorContext } from '../../context/MapEditorContext';
import { addColumn, addRow, removeColumn, removeRow } from './modifyLayout';

export default function CustomModal({ modalIsOpen, closeModal, changeDuplicateMode, changeDeleteMode}) {
  const { layout, setLayout, setEditedZones, duplicateMode, deleteMode } = useContext(MapEditorContext); 
  const [inputRows, setInputRows] = useState(layout.length);
  const [inputColumns, setInputColumns] = useState(layout[0].length);

  useEffect(() => {
    if (!inputRows || !inputColumns) return;
  
    setLayout(prev => {
      const newLayout = [...prev]
  
      while (inputRows > newLayout.length) {
        addRow(newLayout);
      }
      while (inputRows < newLayout.length) {
        removeRow(newLayout);
      }
      while (inputColumns > newLayout[0].length) {
        addColumn(newLayout);
      }
      while (inputColumns < newLayout[0].length) {
        removeColumn(newLayout);
      }
      return newLayout;
    });

    setEditedZones(prev => {
      const newZones = [...prev];

      for (const zone of newZones) {
        const zoneLayout = zone.zone_layout;
        const zonePosition = zone.zone_position;
        let zoneAffected = false;

        for (let i = 0; i < zoneLayout.length; i++) {
          for (let j = 0; j < zoneLayout[i].length; j++) {
            const row = zonePosition.row + i;
            const col = zonePosition.column + j;
            if (row >= inputRows || col >= inputColumns) {
              zoneAffected = true;
              break;
            }
          }
          if (zoneAffected) break;
        }

        if (!zoneAffected) continue;
        while (zoneLayout.length > 0 && inputRows < zoneLayout.length) {
          removeRow(zoneLayout);
        }
        while (zoneLayout[0] && inputColumns < zoneLayout[0].length) {
          removeColumn(zoneLayout);
        }   
      }

      return newZones;
    })
  }, [inputRows, inputColumns, setLayout, setEditedZones]);  

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="SettingsWindow"
      style={{
        content: {
          backgroundColor: '#171717',
          width: '40svw',
          height: '50svh',
          top: '19%',
          left: '47%',
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
      <p className='font-bold text-lg'>Settings</p>
      { !layout ? null 
        : <div className='w-full h-[40%] flex flex-col gap-[20%] justify-center text-center items-center'>
            <div className='flex gap-[2%] items-center justify-center w-[80%]'>
                <p className='absolute left-[6svw] font-bold'>Width:</p>
                <button className='add_remove_button p-0 leading-none' onClick={() => { setInputColumns(inputColumns > 1 ? inputColumns - 1 : inputColumns) }}>-</button>
                <input name='columns' className='bg-gray-custom border-2 border-white rounded-lg w-[50%] text-center border-secondary-hover outline-none' 
                  value={inputColumns <= 130 ? inputColumns : 130} 
                  onChange={(e) => {
                    const value = Number(e.target.value > 0 ? e.target.value : 0);
                    setInputColumns(value <= 130 ? value : 130);
                  }}
                />
                <button className='add_remove_button' onClick={() => setInputColumns(inputColumns < 130 ? inputColumns + 1 : 130)}>+</button>
            </div>
            <div className='flex gap-[2%] items-center w-[80%] justify-center'>
                <p className='absolute left-[6svw] font-bold'>Height:</p>
                <button className='add_remove_button p-0 leading-none' onClick={() => setInputRows(inputRows > 1 ? inputRows - 1 : inputRows)}>-</button>
                <input name='rows' className='bg-gray-custom border-2 border-white rounded-lg w-[50%] text-center border-secondary-hover outline-none' 
                  value={inputRows <= 130 ? inputRows : 130} 
                  onChange={(e) => {
                    const value = Number(e.target.value > 0 ? e.target.value : 0);
                    setInputRows(value <= 130 ? value : 130);
                  }}
                />
                <button className='add_remove_button' onClick={() => setInputRows(inputRows < 130 ? inputRows + 1 : 130)}>+</button>
            </div>
          </div>}
        <div className='w-full h-[40%] flex flex-col gap-5 justify-center text-center items-center'>
          <div className='flex items-center justify-center w-[70%]'>
            <p className='absolute left-[8svw] font-bold'>Duplicate Mode:</p> 
            <p onClick={changeDuplicateMode} className={`${duplicateMode ? 'text-green-500' : 'text-red-500'} bg-gray-custom border-2 border-white rounded-lg p-[2%] pr-[3%] pl-[3%] text-sm border-secondary-hover hover:cursor-pointer`}>
                {duplicateMode ? 'On' : 'Off'}
            </p>
          </div>
          <div className='flex items-center justify-center w-[70%]'>
            <p className='absolute left-[8svw] font-bold'>Delete Mode:</p>
            <p onClick={changeDeleteMode} className={`${deleteMode ? 'text-green-500' : 'text-red-500'} bg-gray-custom border-2 border-white rounded-lg p-[2%] pr-[3%] pl-[3%] text-sm border-secondary-hover hover:cursor-pointer`}>
                {deleteMode ? 'On' : 'Off'}
            </p>
          </div>
        </div>
      <button className='rounded-full p-[1%] border-offwhite border-[0.3svh] border-secondary-hover bg-offwhite text-black text-[2svh] w-[11%] h-[11%] shadow-slate-700 mt-5' onClick={closeModal}>Close</button>
    </Modal>
  );
}