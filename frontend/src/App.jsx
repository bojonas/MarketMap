import { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import { getTabs } from './helper/getTabs';
import { sortObject } from './helper/sortObject';
import { useAdjustScale } from './helper/useAdjustScale';
import { DimensionContext } from './DimensionContext';
import { useTrackCommand } from './helper/useTrackCommand';

// define permission for tabs
const tabPermission = [
  { name: 'Home', permission: 'all' },
  { name: 'Map Viewer', permission: 'all' },
  { name: 'Map Editor', permission: 'market' },
  { name: 'Login', permission: 'all' },
  { name: 'Register', permission: 'all' }
];
// custom navigation order (!whitespaces important!)
const order = [];
for (let tab of tabPermission) {
  order.push(tab.name);
}

export default function App() {
  const ref = useRef(null);
  const { width, height } = useAdjustScale(ref);

  // track if command key is pressed
  const [isCommandKey, setIsCommandKey] = useState(false);
  useTrackCommand(setIsCommandKey);

  const userPermission = 'admin';

  const tabs = sortObject(getTabs(tabPermission), order);
  return (
    <DimensionContext.Provider value={{ width, height, isCommandKey }}>
      <div className='flex flex-col h-[100svh] w-[100svw] bg-black-custom' ref={ref}>
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
    <NavLink to={`/${tab}`} className='custom-button rounded-xl ml-3 border-none w-fit h-[6svh] '
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