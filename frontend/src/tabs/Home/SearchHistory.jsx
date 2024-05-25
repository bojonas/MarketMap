import { useEffect, useState } from "react";
import { requestGetHistory } from "../../requests/homeRequests";
import MiniMap from "./MiniMap";
import { FaTrashCan } from "react-icons/fa6";
import { getTimePassed } from "../../helper/getTimePassed";
import { requestRemoveHistory } from "../../requests/homeRequests";

export default function SearchHistory({ user_id, markets, setMarket }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!user_id) return;
        const getHistory = async () => {
            const data = await requestGetHistory(user_id);
            if (data) setHistory(data);
        }
        getHistory();
    }, [user_id]);

    const removeHistory = async (market_id) => {
        if (!user_id || !market_id) return;
        const rowCount = await requestRemoveHistory(user_id, market_id)
        if (rowCount > 0) setHistory(history.filter(market => market.market_id !== market_id));
    }

    return (
        <div className='absolute z-0 bottom-[5%] left-[5%] flex flex-col w-1/3 h-2/3 text-black bg-darkoffwhite rounded-xl'>
            <p className='p-[3svh] text-[2.5svh] font-bold'>Search History:</p>
            <div className='flex flex-col w-full h-full p-[4%] gap-[5%] bg-offwhite overflow-scroll rounded-b-xl'>
                { history.map(hist => {
                    const market = markets.find(market => market.market_id === hist.market_id);
                    if (!market) return null;
                    const [time, entity] = getTimePassed(hist.hist_timestamp)
                    return (
                        <div key={market.market_id} className='flex w-full items-center justify-between pl-[5%] pr-[5%] cursor-pointer'>
                            <MiniMap layout={market.map_layout} market={market} setMarket={setMarket}/>
                            <p className='w-[20%] font-bold'>{market.market_name}</p>
                            <p>{time}{entity} ago</p>
                            <FaTrashCan onClick={() => removeHistory(market.market_id)} className='hover:text-purple-custom'/>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}