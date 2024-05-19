import Modal from 'react-modal';
import { useContext, useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { addRow, addColumn, removeRow, removeColumn } from '../../helper/editLayout'
import { MapEditorContext } from '../../DimensionContext';

export default function CustomModal({ layout, setLayout, modalIsOpen, closeModal, changeDuplicateMode, changeDeleteMode}) {
  const { duplicateMode, deleteMode } = useContext(MapEditorContext); 
  const [inputRows, setInputRows] = useState(layout.length);
  const [inputColumns, setInputColumns] = useState(layout[0].length);

  const debouncedSetLayout = debounce(setLayout, 1000);

  useEffect(() => {
    if(!inputRows || !inputColumns) return;
    while(inputRows > layout.length) {
      debouncedSetLayout(addRow(layout));
    }
    while(inputRows < layout.length) {
      debouncedSetLayout(removeRow(layout));
    }
    while(inputColumns > layout[0].length) {
      debouncedSetLayout(addColumn(layout));
    }
    while(inputColumns < layout[0].length) {
      debouncedSetLayout(removeColumn(layout));
    }
  }, [inputRows, inputColumns, layout, setLayout, debouncedSetLayout]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Settings Modal"
      style={{
        content: {
          backgroundColor: '#171717',
          width: '50svw',
          height: '50svh',
          top: '16svh',
          left: '45%',
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
      { layout 
        ? <div className='w-[80%] h-[40%] flex flex-col gap-5 justify-center text-center items-center'>
            <div className='flex gap-2 items-center justify-center w-[70%]'>
                <p className='absolute left-[8svw] font-bold'>Width:</p>
                <button className='add_remove_button p-0 leading-none' onClick={() => { setInputColumns(inputColumns > 1 ? inputColumns - 1 : inputColumns) }}>-</button>
                <input className='bg-gray-custom border-2 border-white rounded-lg w-[50%] shadow-md shadow-slate-700 text-center outline-purple-custom' 
                  value={inputColumns <= 130 ? inputColumns : 130} 
                  onChange={(e) => {
                    const value = Number(e.target.value > 0 ? e.target.value : 0);
                    setInputColumns(value <= 130 ? value : 130);
                  }}
                />
                <button className='add_remove_button' onClick={() => setInputColumns(inputColumns < 130 ? inputColumns + 1 : 130)}>+</button>
            </div>
            <div className='flex gap-2 items-center w-[70%] justify-center'>
                <p className='absolute left-[8svw] font-bold'>Height:</p>
                <button className='add_remove_button p-0 leading-none' onClick={() => setInputRows(inputRows > 1 ? inputRows - 1 : inputRows)}>-</button>
                <input className='bg-gray-custom border-2 border-white rounded-lg w-[50%] shadow-md shadow-slate-700 text-center outline-purple-custom' 
                  value={inputRows <= 130 ? inputRows : 130} 
                  onChange={(e) => {
                    const value = Number(e.target.value > 0 ? e.target.value : 0);
                    setInputRows(value <= 130 ? value : 130);
                  }}
                />
                <button className='add_remove_button' onClick={() => setInputRows(inputRows < 130 ? inputRows + 1 : 130)}>+</button>
            </div>
          </div>
        : null }
        <div className='w-[80%] h-[40%] flex flex-col gap-5 justify-center text-center items-center'>
          <div className='flex gap-2 items-center justify-center w-[70%]'>
            <p className='absolute left-[8svw] font-bold'>Duplicate Mode:</p> 
            <p onClick={changeDuplicateMode} className={`${duplicateMode ? 'text-green-500' : 'text-red-500'} bg-gray-custom border-2 border-white rounded-lg w-[15%] shadow-md shadow-slate-700 p-1 text-sm hover:cursor-pointer`}>
                {duplicateMode ? 'On' : 'Off'}
            </p>
          </div>
          <div className='flex gap-2 items-center justify-center w-[70%]'>
            <p className='absolute left-[8svw] font-bold'>Delete Mode:</p>
            <p onClick={changeDeleteMode} className={`${deleteMode ? 'text-green-500' : 'text-red-500'} bg-gray-custom border-2 border-white rounded-lg w-[15%] shadow-md shadow-slate-700 p-1 text-sm hover:cursor-pointer`}>
                {deleteMode ? 'On' : 'Off'}
            </p>
          </div>
        </div>
      <button className='custom-button text-base w-[12%] h-[12%] shadow-slate-700 mt-5' onClick={closeModal}>Close</button>
    </Modal>
  );
}