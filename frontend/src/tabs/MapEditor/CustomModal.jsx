import Modal from 'react-modal';
import { useContext } from 'react';
import { addRow, addColumn, removeRow, removeColumn } from '../../helper/editLayout'
import { DimensionContext } from '../../DimensionContext';

export default function CustomModal({ layout, setLayout, modalIsOpen, closeModal, changeDuplicateMode, changeDeleteMode}) {
    const { duplicateMode, deleteMode } = useContext(DimensionContext); 
    return (
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
          <p className='font-bold text-lg'>Settings</p>
          { layout 
            ? <div className='w-[80%] h-[80%] flex flex-col gap-5 justify-center text-center items-center'>
              <div className='flex gap-2 items-center justify-center w-[70%]'>
                  <p className='absolute left-[8svw] font-bold'>Width:</p>
                  <button className='add_remove_button' onClick={() => setLayout(removeColumn(layout))}>-</button>
                  <p className='bg-gray-custom border-2 border-white rounded-lg w-[50%] shadow-md shadow-slate-700'>{layout[0].length}</p>
                  <button className='add_remove_button' onClick={() => setLayout(addColumn(layout))}>+</button>
              </div>
              <div className='flex gap-2 items-center w-[70%] justify-center'>
                  <p className='absolute left-[8svw] font-bold'>Height:</p>
                  <button className='add_remove_button' onClick={() => setLayout(removeRow(layout))}>-</button>
                  <p className='bg-gray-custom border-2 border-white rounded-lg w-[50%] shadow-md shadow-slate-700'>{layout.length}</p>
                  <button className='add_remove_button' onClick={() => setLayout(addRow(layout))}>+</button>
              </div>
              <div className='flex gap-2 items-center justify-center w-[70%]'>
                <p className='absolute left-[8svw] font-bold'>Duplicate Mode:</p>
                <p onClick={changeDuplicateMode} className={`${duplicateMode ? 'text-green-500' : 'text-red-500'} bg-gray-custom border-2 border-white rounded-lg w-[15%] shadow-md shadow-slate-700`}>
                    {duplicateMode ? 'On' : 'Off'}
                </p>
              </div>
              <div className='flex gap-2 items-center justify-center w-[70%]'>
                <p className='absolute left-[8svw] font-bold'>Delete Mode:</p>
                <p onClick={changeDeleteMode} className={`${deleteMode ? 'text-green-500' : 'text-red-500'} bg-gray-custom border-2 border-white rounded-lg w-[15%] shadow-md shadow-slate-700 items-center`}>
                    {deleteMode ? 'On' : 'Off'}
                </p>
              </div>
              </div>
            : null }
          <button className='custom-button text-base w-[12%] h-[12%] shadow-slate-700' onClick={closeModal}>Close</button>
        </Modal>
    );
  }