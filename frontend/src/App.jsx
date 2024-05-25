import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import Tab from './atoms/Tab';
import { getTabs } from './helper/getTabs';
import { sortObject } from './helper/sortObject';
import { TabContext } from './DimensionContext';
import MyAccount from './myAccount/MyAccount';
import Login from './myAccount/Login/Login';
import Register from './myAccount/Register/Register';
import MyProfile from './myAccount/MyProfile/MyProfile';

// define permission for tabs
const tabPermission = [
  { name: 'Home', permission: 'all' },
  { name: 'My Market', permission: 'market' },
  { name: 'Login', permission: 'all' },
  { name: 'Register', permission: 'all' },
  { name: 'My Profile', permission: 'user' }
];
// custom navigation order
const order = [];
for (const tab of tabPermission) {
  order.push(tab.name);
}

export default function App() {
  const [activeTab, setActiveTab] = useState(null);
  const springStyle = useSpring(activeTab || { width: 0 });

  const userPermission = 'admin';
  const tabs = sortObject(getTabs(tabPermission), order);
  return (
    <div className='flex flex-col w-[100svw] h-[100svh] bg-darkgray-custom'>
      <Router>
        <div className='relative flex items-center justify-between bg-darkgray-custom w-full h-[10svh]'>
          <TabContext.Provider value={{ activeTab, setActiveTab }}>
            <div className='flex h-full w-[25svw] items-center pl-[1svw] bg-purple-custom'>
              <MyAccount/>
            </div>
            <div className='flex h-full w-[75svw] pr-[1svw] items-center justify-end pl-[1svw] border-b-[0.5svh] border-gray-custom'>
              {tabs.map(({ name, tab, Icon, permission }) => 
                (permission === 'all' || userPermission === 'admin' || userPermission === permission) && <Tab key={name} tab={tab} name={name} Icon={Icon}/>
              )}
            </div>
          </TabContext.Provider>
          <animated.div className='absolute h-[0.5svh] -bottom-0 bg-purple-custom rounded-lg' style={{ ...springStyle }}/>
        </div>
        <Routes>
          {tabs.map(({ tab, Component, permission }, index) => 
            (permission === 'all' || userPermission === 'admin' || userPermission === permission) && <Route key={index} path={`/${tab}`} element={<Component/>}/>
          )}
          <Route path={"/login"} element={<Login/>}/>
          <Route path={"/register"} element={<Register/>}/>
          <Route path={"/my_profile"} element={<MyProfile/>}/>
        </Routes>
      </Router>
    </div>
  );
}