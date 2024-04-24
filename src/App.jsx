import { BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import { getRoutes } from './helper/getRoutes';
import { sortObject } from './helper/sortObject';

// custom navigation order (!whitespaces important!)
const order = ['Home', 'Map Viewer', 'Map Editor'];
const routes = sortObject(getRoutes(), order);

export default function App() {
  return (
    <div className='flex flex-col h-screen w-screen bg-black-custom'>
      <Router>
        <div className="flex-grow grid grid-flow-col items-center justify-start bg-gray-custom w-[100vw] max-w-[100vw] h-[10vh] max-h-[10vh]">
          {routes.map(({ name, route }) => 
            <Tab key={route} tab={route} name={name}/>
          )}
        </div>
        <Routes>
          {routes.map(({ route, Component }) => 
            <Route key={route} path={`/${route}`} element={<Component/>} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

function Tab({ name, tab }) {
  return (
    <NavLink to={`/${tab}`} 
        className='custom-button w-fit rounded-xl ml-3 font-medium border-none hover:border-none hover:bg-gray-button-hover'
        style={({ isActive }) => {
            return {
                backgroundColor: isActive ? '#715DF2' : '#303030',
                boxShadow: isActive ? '0 4px 6px -1px #334155, 0 2px 4px -2px #334155' : '',
            }
        }}
    >{name}</NavLink>
  );
}