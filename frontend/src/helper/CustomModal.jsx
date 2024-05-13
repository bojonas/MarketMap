import Modal from 'react-modal';
import { addRow, addColumn, removeRow, removeColumn } from './editLayout'

export default function CustomModal({ layout, setLayout, modalIsOpen, closeModal }) {
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
          <h2>Settings</h2>
          { layout 
            ? <div className='w-[80%] h-[80%] flex flex-col gap-5 justify-center text-center items-center'>
              <div className='flex gap-2 items-center w-[70%] justify-center'>
                  <p className='absolute left-[8svw]'>Width:</p>
                  <button className='add_remove_button' onClick={() => setLayout(removeColumn(layout))}>-</button>
                  <p className='bg-gray-custom border-2 border-white rounded-lg w-[50%] shadow-md shadow-slate-700'>{layout[0].length}</p>
                  <button className='add_remove_button' onClick={() => setLayout(addColumn(layout))}>+</button>
              </div>
              <div className='flex gap-2 items-center w-[70%] justify-center'>
                  <p className='absolute left-[8svw]'>Height:</p>
                  <button className='add_remove_button' onClick={() => setLayout(removeRow(layout))}>-</button>
                  <p className='bg-gray-custom border-2 border-white rounded-lg w-[50%] shadow-md shadow-slate-700'>{layout.length}</p>
                  <button className='add_remove_button' onClick={() => setLayout(addRow(layout))}>+</button>
              </div>
            </div>
            : null }
          <button className='custom-button text-base w-[15%] h-[15%] shadow-slate-700' onClick={closeModal}>Close</button>
        </Modal>
    );
  }