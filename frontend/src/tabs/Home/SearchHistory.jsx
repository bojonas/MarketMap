import { useEffect, useState } from 'react';
import { requestGetHistory } from "../../requests/homeRequests";
import MiniMap from "./MiniMap";
import { FaTrashCan } from "react-icons/fa6";
import { getTimePassed } from "../../helper/getTimePassed";
import { requestRemoveHistory } from "../../requests/homeRequests";

export default function SearchHistory({ user_id, markets, selectMarket, images }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!user_id) return setHistory([]);
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
        <div className='absolute z-0 flex flex-col bottom-[2%] p-[2%] ml-[2%] w-1/3 h-5/6'>
            <div className='flex flex-col w-full h-full rounded-2xl bg-custom'>
                <p className='p-[2svh] text-[2svh] font-bold'>Search History:</p>
                <div className='flex flex-col w-full h-full items-center p-[4%] gap-[4%] bg-gray-custom overflow-scroll rounded-b-2xl'>
                    { history.map(hist => {
                        const market = markets.find(market => market.market_id === hist.market_id);
                        if (!market) return null;
                        const [time, entity] = getTimePassed(hist.hist_timestamp)
                        return (
                            <div key={market.market_id} className='flex w-full items-center justify-between pl-[5%] pr-[5%] bg-darkgray-custom rounded-3xl'>
                                <MiniMap layout={market.map_layout} market={market} selectMarket={selectMarket} images={images}/>
                                <div className='flex items-center justify-center gap-[10%] w-[35%]'>
                                    { market.market_image_url && 
                                    <div className='flex items-center justify-center rounded-sm w-[2svw] h-[4svh] border-[0.5svh] border-darkgray-custom bg-gray-custom'>
                                        <img draggable='false' alt='' src={market.market_image_url}/>
                                    </div>
                                    }
                                    <div className="relative overflow-hidden whitespace-nowrap">
                                        <p className="inline-block font-bold animation-scroll">
                                            {market.market_name}
                                        </p>
                                    </div>
                                </div>
                                <p className='w-[25%]'>{time}{entity} ago</p>
                                <div className='flex items-center justify-center'>
                                    <FaTrashCan onClick={() => removeHistory(market.market_id)} className='text-custom-hover cursor-pointer'/>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}