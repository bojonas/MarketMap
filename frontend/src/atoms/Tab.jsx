import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Tab({ name, Icon, tab }) {
  let location = useLocation();
  let isActive = location.pathname === `/${tab}`;

  return (
    <div style={{ position: 'relative' }}>
      <NavLink to={`/${tab}`} className='custom-button rounded-xl ml-3 border-none w-fit h-fit text-sm' draggable='false'
          style={{
              backgroundColor: isActive ? '#202020' : '#303030',
              transition: 'background-color 0.5s ease' 
          }}
      > { Icon 
        ? <React.Fragment>
            <Icon isActive={isActive}/> 
            <p className={`ml-[0.5svw] ${isActive ? '' : 'text-[#707070]'}`}>{name}</p>
          </React.Fragment>
      : <p style={{ color: isActive ? '' : '#707070' }}>{name}</p> }
      </NavLink>
      <div className={`h-[0.3svh] absolute top-[7.2svh] left-[1svw] right-0 ${isActive ? 'bg-[#715DF2]' : ''}`}
        style={{ transition: 'background-color 0.5s ease' }}></div>
    </div>
  );
}