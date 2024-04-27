import { useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import { getRoutes } from './helper/getRoutes';
import { sortObject } from './helper/sortObject';
import { useAdjustScale } from './helper/useAdjustScale';
import { DimensionContext } from './DimensionContext';
import { useTrackCommand } from './helper/useTrackCommand';

// custom navigation order (!whitespaces important!)
const order = ['Home', 'Map Viewer', 'Map Editor', 'Login'];
const routes = sortObject(getRoutes(), order);

export default function App() {
  const ref = useRef(null);
  const { width, height } = useAdjustScale(ref);

  // track if command key is pressed
  const [isCommandKey, setIsCommandKey] = useState(false);
  useTrackCommand(setIsCommandKey);
  return (
    <DimensionContext.Provider value={{ width, height, isCommandKey }}>
      <div className='flex flex-col h-screen w-screen bg-black-custom' ref={ref}>
        <Router>
          <div className='flex-grow grid grid-flow-col items-center justify-start bg-gray-custom w-full'
            style={{ height: `${height/10}px` }}
          >
            {routes.map(({ name, Icon, route }) => 
              <Tab key={name} route={route} name={name} Icon={Icon} width={width} height={height}/>
            )}
          </div>
          <Routes>
            {routes.map(({ route, Component }, index) => 
              <Route key={index} path={`/${route}`} element={<Component/>} />
            )}
          </Routes>
        </Router>
      </div>
    </DimensionContext.Provider>
  );
}

function Tab({ name, Icon, route, width, height }) {
  const scale = Math.min(width, height);
  return (
    <NavLink to={`/${route}`} 
        className='custom-button rounded-xl ml-3 border-none'
        style={({ isActive }) => {
            return {
              height: `${scale/13}px`,
              width: `${scale/10}px`,
              fontSize: `${scale/35}px`,
              padding: `${scale/50}px`,
              backgroundColor: isActive ? '#715DF2' : '#303030',
              boxShadow: isActive ? '0 4px 6px -1px #334155, 0 2px 4px -2px #334155' : '',
            }
        }}
    > {
      Icon ? <Icon/> : name
    }
    </NavLink>
  );
}