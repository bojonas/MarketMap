import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import { getTabs } from './helper/getTabs';
import { sortObject } from './helper/sortObject';
import { DimensionContext } from './DimensionContext';
import { useChangeDragMode } from './helper/useChangeDragMode';

// define permission for tabs
const tabPermission = [
  { name: 'Home', permission: 'all' },
  { name: 'Map Viewer', permission: 'all' },
  { name: 'Map Editor', permission: 'market' },
  { name: 'Login', permission: 'all' },
  { name: 'Register', permission: 'all' },
  { name: 'Forgot Password', permission: 'all' }
];
// custom navigation order (!whitespaces important!)
const order = [];
for (let tab of tabPermission) {
  order.push(tab.name);
}

export default function App() {
  const [trackedCells, setTrackedCells] = useState([]);
  // track if command key is pressed
  const [addDuplicate, setAddDuplicate] = useState(false);
  useChangeDragMode(setAddDuplicate);

  const userPermission = 'admin';

  const tabs = sortObject(getTabs(tabPermission), order);
  return (
    <DimensionContext.Provider value={{ addDuplicate, trackedCells, setTrackedCells }}>
      <div className='flex flex-col h-[100svh] w-[100svw] bg-black-custom'>
        <Router>
          <div className='flex-grow grid grid-flow-col items-center justify-start bg-gray-custom w-full h-[9svh]'>
            {tabs.map(({ name, tab, Icon, permission }) => 
              (permission === 'all' || userPermission === 'admin' || userPermission === permission) ? <Tab key={name} tab={tab} name={name} Icon={Icon}/> : null
            )}
          </div>
          <Routes>
            {tabs.map(({ tab, Component, permission }, index) => 
              (permission === 'all' || userPermission === 'admin' || userPermission === permission) ? <Route key={index} path={`/${tab}`} element={<Component/>}/> : null
            )}
          </Routes>
        </Router>
      </div>
    </DimensionContext.Provider>
  );
}

function Tab({ name, Icon, tab }) {
  return (
    <NavLink to={`/${tab}`} className='custom-button rounded-xl ml-3 border-none w-fit h-[6svh]' draggable='false'
        style={({ isActive }) => {
            return {
              backgroundColor: isActive ? '#715DF2' : '#303030',
              boxShadow: isActive ? '0 4px 6px -1px #334155, 0 2px 4px -2px #334155' : '',
            }
        }}
    > {
      Icon ? <Icon/> : name
    }
    </NavLink>
  );
}