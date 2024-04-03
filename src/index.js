import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Toolbar from './Toolbar';
import Map from './Map';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='flex bg-slate-600'>
      <div className='flex justify-center bg-slate-600'>
        <Map/>
      </div>
      <Toolbar/>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();