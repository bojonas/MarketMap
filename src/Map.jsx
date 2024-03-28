import Layout from "./Layout";

const data = [
  ['empty', 'checkout', 'empty', 'shelf', 'empty'],
  ['empty', 'empty', 'empty', 'shelf', 'empty'],
  ['empty', 'empty', 'empty', 'shelf', 'empty'],
  ['empty', 'empty', 'empty', 'shelf', 'empty'],
];

function Map() {
    return (
    <div className="bg-slate-700">
        <Layout layout={ data }/>
    </div>
    );
}

export default Map