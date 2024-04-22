import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getRoutes } from './helper/getRoutes';
import { sortObject } from './helper/sortObject';

// custom navigation order (!whitespaces important!)
const order = ['Home', 'Map Viewer', 'Map Editor'];
const routes = sortObject(getRoutes(), order);

export default function App() {
  return (
    <div className='flex flex-col h-screen w-screen'>
      <Router>
        <div className="flex-grow grid grid-flow-col gap-4 items-center justify-center bg-slate-900 h-full">
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
    <Link to={`/${tab}`} className="bg-sky-950 text-white w-fit rounded-xl p-4 text-xl font-bold">{name}</Link>
  );
}