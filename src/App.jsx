import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getRoutes } from './helper/getRoutes';
import { sortObject } from './helper/sortObject';

// custom navigation order (!whitespaces important!)
const order = ['Home', 'Map Viewer', 'Map Editor'];
const routes = sortObject(getRoutes(), order);

export default function App() {
  return (
    <div className='flex flex-col h-screen w-screen bg-black-custom'>
      <Router>
        <div className="flex-grow grid grid-flow-col items-center justify-start w-full h-full bg-gray-custom">
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
    <Link to={`/${tab}`} className={'custom-button w-fit rounded-xl ml-3 bg-gray-button font-medium border-none hover:border-none hover:bg-gray-button-hover'}>{name}</Link>
  );
}