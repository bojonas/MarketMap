import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getTabs } from './helper/getTabs';
import { sortObject } from './helper/sortObject';
import Login from './myAccount/Login/Login';
import Register from './myAccount/Register/Register';
import MyProfile from './myAccount/MyProfile/MyProfile';
import { tabPermission } from './tabPermission';
import Navbar from './atoms/Navbar';
import Settings from './myAccount/Settings/Settings';
import Uploader from './uploader/Uploader';

// custom navigation order
const order = [];
for (const tab of tabPermission) {
  order.push(tab.name);
}

export default function App() {
  const userPermission = localStorage.getItem('permission');
  const [isLoggedIn, setIsLoggedIn] = useState(userPermission ? true : false);
  const tabs = sortObject(getTabs(tabPermission), order);

  return (
    <div className='flex flex-col w-[100svw] h-[100svh] bg-darkgray-custom'>
      <Router>
        <Navbar tabs={tabs} userPermission={userPermission} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Routes>
          { tabs.map(({ tab, Component, permission }, index) => 
            (permission === 'all' || userPermission === 'admin' || userPermission === permission) && <Route key={index} path={`/${tab}`} element={<Component/>}/>
          )}
          {!isLoggedIn&&<Route path={"/login"} element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>}
          {!isLoggedIn&&<Route path={"/register"} element={<Register/>}/>}
          {isLoggedIn&&<Route path={"/settings"} element={<Settings/>}/>}
          {isLoggedIn&&<Route path={"/my_profile"} element={<MyProfile/>}/>}
          <Route path={'/uploader'} element={<Uploader/>}/>
        </Routes>
      </Router>
    </div>
  );
}