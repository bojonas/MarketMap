import { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import { getRoutes } from './helper/getRoutes';
import { sortObject } from './helper/sortObject';
import { useAdjustScale } from './helper/useAdjustScale';
import { FaHouse } from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

// custom navigation order (!whitespaces important!)
const order = ['Home', 'Map Viewer', 'Map Editor', 'Login'];
const routes = sortObject(getRoutes(), order);

export default function App() {
  const ref = useRef(null);
  const { width, height } = useAdjustScale(ref);

  const scale = Math.min(width, height);
  return (
    <div className='flex flex-col h-screen w-screen bg-black-custom' ref={ref}>
      <Router>
        <div className='flex-grow grid grid-flow-col items-center justify-start bg-gray-custom w-[100vw] max-w-[100vw]'
          style={{ height: `${height/10}px` }}
        >
          {routes.map(({ name, route }) => 
            <Tab key={route} tab={route} name={name} height={height} scale={scale}/>
          )}
        </div>
        <Routes>
          {routes.map(({ route, Component }) => 
            <Route key={route} path={`/${route}`} element={<Component width={width} height={height}/>} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

function Tab({ name, tab, height, scale}) {
  return (
    <NavLink to={`/${tab}`} 
        className='custom-button w-fit rounded-xl ml-3 border-none hover:border-none hover:bg-gray-button-hover'
        style={({ isActive, isPending }) => {
            return {
              height: `${height/13}px`,
              backgroundColor: isActive ? '#715DF2' : '#303030',
              boxShadow: isActive ? '0 4px 6px -1px #334155, 0 2px 4px -2px #334155' : '',
              fontSize: `${scale/35}px`,
            }
        }}
    >{name}</NavLink>
  );
}