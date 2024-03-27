import Layout from "./Layout";

const mockData = [
    [
      { type: 'aisle' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'checkout' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'empty' },
      { type: 'empty' },
    ],
    [
      { type: 'aisle' },
      { type: 'aisle' },
      { type: 'empty' },
      { type: 'checkout' },
      { type: 'checkout' }
    ],
    [
      { type: 'aisle' },
      { type: 'aisle' },
      { type: 'empty' },
      { type: 'checkout' },
      { type: 'checkout' }
    ],
    [
      { type: 'aisle' },
      { type: 'aisle' },
      { type: 'empty' },
      { type: 'checkout' },
      { type: 'checkout' }
    ],
    [
      { type: 'aisle' },
      { type: 'aisle' },
      { type: 'empty' },
      { type: 'checkout' },
      { type: 'checkout' }
    ],
    [
        { type: 'aisle' },
        { type: 'aisle' },
        { type: 'empty' },
        { type: 'checkout' },
        { type: 'checkout' }
      ]
  ];


function MapEditor() {
    return (
    <div className="flex-grow text-center justify-center items-center bg-slate-700 h-screen">
        <p className="text-white ">This is the map editor</p>
        <br/>
        <Layout data={mockData}/>
    </div>
    );
}

export default MapEditor