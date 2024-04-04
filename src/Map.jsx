import Layout from "./Layout";
import React, { useState, useEffect, useRef } from 'react'

const rows = 12;
const columns = 20;

const data = [];
for (let i = 0; i < rows; i++) {
  data.push([]);
  for (let j = 0; j < columns; j++) {
    if (i === 0 && j === 1) {
      data[i].push('checkout');
      continue;
    }

    if (j === 3 && i < 7) {
      data[i].push('shelf');
      continue;
    }

    data[i].push('empty');
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
    <div className="bg-slate-700 h-[100vh] max-h-[100vh] w-[75vw] max-w-[75vw] content-center justify-center" ref={ref}>
      <Layout layout={data} height={height} width={width} />
    </div>
  );
}