import Modal from 'react-modal';
import { useContext, useState, useEffect } from 'react';
import { MapEditorContext } from '../../context/MapEditorContext';
import { addColumn, addRow, removeColumn, removeRow } from './modifyLayout';

export default function CustomModal({ modalIsOpen, closeModal, changeDuplicateMode, changeDeleteMode}) {
  const { layout, setLayout, setEditedZones, duplicateMode, deleteMode } = useContext(MapEditorContext); 
  const [inputRows, setInputRows] = useState(layout.length);
  const [inputColumns, setInputColumns] = useState(layout[0].length);

  useEffect(() => {
    if (!inputRows || !inputColumns || (inputRows === layout.length && inputColumns === layout[0].length)) return;
    
    setLayout(prev => {
      let newLayout = [...prev];

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

        let rowsToRemove = [], colsToRemove = [];
        for (let i = 0; i < zoneLayout.length; i++) {
          for (let j = 0; j < zoneLayout[i].length; j++) {
            const row = zonePosition.row + i;
            const col = zonePosition.column + j;
            if (row >= inputRows || col >= inputColumns) {
              if (row >= inputRows && !rowsToRemove.includes(i)) {
                rowsToRemove.push(i);
              }
              if (col >= inputColumns && !colsToRemove.includes(j)) {
                colsToRemove.push(j);
              }
            }
          }
        }
        
        rowsToRemove.sort((a, b) => b - a);
        colsToRemove.sort((a, b) => b - a);
        for (let i = rowsToRemove.length - 1; i >= 0; i--) {
          if (zoneLayout.length) removeRow(zoneLayout, zonePosition);
        }
    
        for (let j = colsToRemove.length - 1; j >= 0; j--) {
          if (zoneLayout[0].length) removeColumn(zoneLayout, zonePosition);
        }

        // remove not selected rows and columns
        let rowsToKeep = new Set();
        let colsToKeep = new Set();
        for (let i = 0; i < zoneLayout.length; i++) {
          for (let j = 0; j < zoneLayout[0].length; j++) {
            if (typeof zoneLayout[i][j].zone_id !== 'number') continue;
            rowsToKeep.add(i);
            colsToKeep.add(j);
          }
        }
        zone.zone_layout = zoneLayout.filter((_, i) => rowsToKeep.has(i));
        zone.zone_layout.map(row => row.filter((_, j) => colsToKeep.has(j))); 
        zone.rows = zone.zone_layout.length;
        zone.columns = zone.rows ? zone.zone_layout[0].length : 0;
        const firstCell = zone.zone_layout[0][0];
        zone.zone_position = { row: firstCell.x, column: firstCell.y }
      }

      return newZones;
    });    

  }, [inputRows, inputColumns, layout, setLayout, setEditedZones]);  

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