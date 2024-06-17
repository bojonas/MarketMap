import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getTabs } from './helper/getTabs';
import { sortObject } from './helper/sortObject';
import Login from './myAccount/Login/Login';
import Register from './myAccount/Register/Register';
import { tabPermission } from './tabPermission';
import Navbar from './atoms/Navbar';
import Settings from './myAccount/Settings/Settings';
import Uploader from './uploader/Uploader';
import { requestgetUserColor } from './requests/myProfileRequests';
import MyMarketComponent from './myAccount/MyProfile/MyMarketComponent';
import MyProfileComponent from './myAccount/MyProfile/MyProfileComponenet';

// custom navigation order
const order = [];
for (const tab of tabPermission) {
  order.push(tab.name);
}

export default function App() {
  const user_id = localStorage.getItem('user_id');
  const userPermission = localStorage.getItem('permission');
  const [isLoggedIn, setIsLoggedIn] = useState(userPermission ? true : false);
  const tabs = sortObject(getTabs(tabPermission), order);

  useEffect(() => {
    if (!user_id) return;
    const getColor = async () => {
      const data = await requestgetUserColor(user_id);
      document.documentElement.style.setProperty('--custom-color', data.user_color);
    }
    getColor();
  }, [user_id])

  return (
    <div className='flex flex-col w-screen h-screen bg-darkgray-custom'>
      <Router>
        <Navbar tabs={tabs} userPermission={userPermission} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Routes>
          { tabs.map(({ tab, Component, permission }, index) => 
            (permission === 'all' || userPermission === 'admin' || permission.includes(userPermission)) && <Route key={index} path={`/${tab}`} element={<Component/>}/>
          )}
          {!isLoggedIn&&<Route path={"/login"} element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>}
          {!isLoggedIn&&<Route path={"/register"} element={<Register/>}/>}
          {isLoggedIn&&<Route path={"/settings"} element={<Settings/>}/>}
          {isLoggedIn&&<Route path={"/my_profile"} element={<MyProfileComponent/>}/>}
          {isLoggedIn&&<Route path={"/my_market"} element={<MyMarketComponent/>}/>}
          {isLoggedIn&&<Route path={'/uploader'} element={<Uploader/>}/>}
        </Routes>
      </Router>
    </div>
  );
}