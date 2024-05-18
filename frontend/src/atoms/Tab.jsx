import React, { useContext, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { TabContext } from "../DimensionContext";

export default function Tab({ name, Icon, tab }) {
  let location = useLocation();
  let isActive = location.pathname === `/${tab}`;
  const { setActiveTab } = useContext(TabContext);
  const tabRef = useRef(null);

  useEffect(() => {
    if (tabRef.current && isActive) {
      setActiveTab({
        left: tabRef.current.offsetLeft,
        width: tabRef.current.offsetWidth
      });
    }
  }, [isActive, setActiveTab]);

  return (
    <NavLink to={`/${tab}`} className='custom-button mr-[0.75svw] ml-[0.75svw] border-none w-fit h-fit text-sm' 
        draggable='false'
        style={{
            backgroundColor: isActive ? '#202020' : '#303030',
            transition: 'background-color 0.5s ease',
            borderRadius: tab !== 'MyProfile' ? '0.75rem' : '9999px'
        }}
        ref={tabRef}
      > { Icon 
        ? <React.Fragment>
            <Icon isActive={isActive}/> 
            <p className={`ml-[0.5svw] ${isActive ? '' : 'text-[#707070]'}`}>{name}</p>
          </React.Fragment>
      : <p style={{ color: isActive ? '' : '#707070' }}>{name}</p> }
    </NavLink>
  );
}

/*function ProfilePicture({ name }) {
  return (<></>);
}*/