import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tab from './atoms/Tab';
import { getTabs } from './helper/getTabs';
import { sortObject } from './helper/sortObject';
import MapViewer from './tabs/Home/MapViewer';

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
for (let tab of tabPermission) {
  order.push(tab.name);
}

export default function App() {
  const userPermission = 'admin';

  const tabs = sortObject(getTabs(tabPermission), order);
  return (
    <div className='flex flex-col h-[100svh] w-[100svw] bg-black-custom'>
      <Router>
        <div className='flex-grow grid grid-flow-col items-center justify-start bg-gray-custom w-full h-[9svh] border-black borderb-[0.3svh]'>
          {tabs.map(({ name, tab, Icon, permission }) => 
            (permission === 'all' || userPermission === 'admin' || userPermission === permission) && <Tab key={name} tab={tab} name={name} Icon={Icon}/>
          )}
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