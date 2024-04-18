import Layout from "./Layout";
import React, { useState, useEffect, useRef } from 'react'

const rows = 15;
const columns = 22;

const data = [];
for (let i = 0; i < rows; i++) {
  data.push([]);
  for (let j = 0; j < columns; j++) {
    data[i].push({'type': 'empty'});
    data[i][j]['id'] = `${i}-${j}`;

    if (i === 0 && j === 1) {
      data[i][j]['type'] = 'checkout';
    }

    if (j === 3 && i < 7) {
      data[i][j]['type'] = 'shelf';
    }
  }
}

export default function Map() {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setHeight(ref.current.clientHeight);
    setWidth(ref.current.clientWidth);
  }, []);

  return (
    <div className="bg-slate-700">
      <div className="bg-slate-700 w-[75vw] max-w-[75vw] h-[90vh] max-h-[90vh] content-center justify-center text-center" ref={ref}>
        <Layout layout={data} height={height} width={width}/>
      </div>
    </div>
  );
}