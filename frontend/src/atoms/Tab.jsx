import React, { useContext, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { TabContext } from "../DimensionContext";

const Tab = React.memo(({ name, Icon, tab }) => {
  const isActive = useLocation().pathname === `/${tab}`;
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
    <NavLink to={`/${tab}`} className='custom-button mr-[0.75svw] ml-[0.75svw] w-fit h-fit text-sm border-none rounded-xl' 
        draggable='false'
        style={{
            backgroundColor: isActive ? '#212121' : '#171717',
            boxShadow: isActive ? 'none' : 'none',
            transition: 'background-color 0.5s ease'
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
});

export default Tab;