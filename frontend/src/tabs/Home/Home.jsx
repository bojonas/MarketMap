import MapViewer from "./MapViewer";

export default function Home(){
    return (
        <div className='flex h-full w-full content-center justify-center items-center text-center'>
            <MapViewer market_id={1}/>
        </div>
    );
}