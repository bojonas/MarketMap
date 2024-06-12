import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import MyAccount from "../myAccount/MyAccount";
import Tab from "./Tab";

export default function Navbar({ tabs, userPermission, isLoggedIn, setIsLoggedIn }) {
    const [activeTab, setActiveTab] = useState(null);
    const springStyle = useSpring(activeTab || { width: 0 });

    return (
        <div className='relative flex items-center justify-between bg-darkgray-custom w-full h-[10svh]'>
            <div className='flex h-full w-[25svw] items-center bg-custom'>
                <MyAccount isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </div>
                <div className='flex h-full w-[75svw] pr-[1svw] items-center justify-end pl-[1svw] border-b-[0.5svh] border-gray-custom'>
                {tabs.map(({ name, tab, Icon, permission }) => 
                    (permission === 'all' || userPermission === 'admin' || permission.includes(userPermission)) && <Tab key={name} tab={tab} name={name} Icon={Icon} setActiveTab={setActiveTab}/>
                )}
            </div>
            <animated.div className='absolute h-[0.5svh] -bottom-0 rounded-lg bg-custom' style={{ ...springStyle }}/>
        </div>
    );
}