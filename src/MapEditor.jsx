import Layout from "./Layout";

const data = [
    [
      { type: 'empty' }
    ],
    [
      { type: 'checkout' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'shelf' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'shelf' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'shelf' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'shelf' }
    ],
    [
      { type: 'empty' }
    ],
    [
      { type: 'empty' }
    ]
  ];


function MapEditor() {
    for (const entry of data) {
      if (entry.length !== 1) return
    }
    return (
    <div className="flex-grow text-center justify-center items-center bg-slate-700 h-screen">
        <p className="text-white">This is the map editor</p>
        <br/>
        <Layout data={ data }/>
    </div>
    );
}

export default MapEditor