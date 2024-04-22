import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getRoutes } from './helper/getRoutes';
import { sortObjects } from './helper/sortObjects';

// custom navigation order
const order = ['Home', 'MapViewer', 'MapEditor'];
var routes = sortObjects(getRoutes(), order);

export default function App() {
  return (
    <div className='flex flex-col h-screen w-screen'>
      <Router>
        <div className="flex-grow grid grid-flow-col gap-4 items-center justify-center bg-slate-600">
          {routes.map(({ route }) => 
            <Tab key={route} tab={route}/>
          )}
        </div>
        <Routes>
          {routes.map(({ route, Component }) => 
            <Route key={route} path={`/${route}`} element={<Component />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

function Tab({tab}) {
  return (
    <Link to={`/${tab}`} className="w-fit h-fit p-5 rounded-2xl bg-sky-950 text-white">{tab}</Link>
  );
}