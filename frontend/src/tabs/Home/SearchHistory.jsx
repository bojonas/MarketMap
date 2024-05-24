import { useEffect, useState } from "react";
import { requestGetHistory } from "../../requests/homeRequests";
import MiniMap from "./MiniMap";

export default function SearchHistory({ user_id, markets }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!user_id) return;
        const getHistory = async () => {
            const data = await requestGetHistory(user_id);
            if (data) setHistory(data);
        }
        getHistory();
    }, [user_id]);

    return (
        <div className='absolute z-0 bottom-[2svh] flex flex-col w-1/3 h-1/2 text-black bg-darkoffwhite rounded-xl'>
            <p className='p-[3svh] text-[2.5svh] font-bold'>Search History:</p>
            <div className='flex flex-col w-full h-full p-[2%] gap-[5%] bg-offwhite overflow-y-scroll rounded-b-xl'>
                { history.map(hist => {
                    const market = markets.find(market => market.market_id === hist.market_id);
                    if (!market) return null;

                    const difference = new Date().getTime() - new Date(hist.hist_timestamp).getTime();
                    let time = Math.round(difference / (1000 * 60)); 
                    let entity = 'min';
                    if (time >= 60) {
                        time = Math.round(time / 60);
                        entity = 'h'
                    }
                    // days
                    if (time >= 24) {
                        time = Math.round(time / 24);
                        entity = 'days'
                    }
                    return (
                        <div key={market.market_id} className='flex w-full gap-[5%] rounded-xl items-center'>
                            <MiniMap layout={market.map_layout}/>
                            <p>{market.market_name}</p>
                            <p>vor {time} {entity}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}