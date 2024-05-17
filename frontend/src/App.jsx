import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import Tab from './atoms/Tab';
import { getTabs } from './helper/getTabs';
import { sortObject } from './helper/sortObject';
import MapViewer from './tabs/Home/MapViewer';
import { TabContext } from './DimensionContext';

// define permission for tabs
const tabPermission = [
  { name: 'Home', permission: 'all' },
  { name: 'Map Editor', permission: 'market' },
  { name: 'Login', permission: 'all' },
  { name: 'Register', permission: 'all' },
  { name: 'Forgot Password', permission: 'all' },
  { name: 'My Profile', permission: 'all' }
];
// custom navigation order (!whitespaces important!)
const order = [];
for (const tab of tabPermission) {
  order.push(tab.name);
}

export default function App() {
  const [activeTab, setActiveTab] = useState(null);
  const springStyle = useSpring(activeTab || { left: 0, width: 0 });

  const userPermission = 'admin';
  const tabs = sortObject(getTabs(tabPermission), order);
  return (
    <div className='flex flex-col h-[100svh] w-[100svw] bg-black-custom'>
      <Router>
        <div className='relative flex-grow grid grid-flow-col items-center justify-start bg-gray-custom w-full h-[9svh]'>
          <TabContext.Provider value={{ activeTab, setActiveTab }}>
            {tabs.map(({ name, tab, Icon, permission }) => 
              (permission === 'all' || userPermission === 'admin' || userPermission === permission) && <Tab key={name} tab={tab} name={name} Icon={Icon}/>
            )}
            <animated.div className="h-[0.3svh] w-full absolute top-[8.2svh] bg-[#715DF2]" style={{ ...springStyle, position: 'absolute' }}></animated.div>
          </TabContext.Provider>
        </div>
        <Routes>
          {tabs.map(({ tab, Component, permission }, index) => 
            (permission === 'all' || userPermission === 'admin' || userPermission === permission) && <Route key={index} path={`/${tab}`} element={<Component/>}/>
          )}
          <Route path='/map' element={<MapViewer/>}/>
        </Routes>
      </Router>
    </div>
  );
}