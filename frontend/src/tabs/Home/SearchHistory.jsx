import { useEffect, useState } from "react";
import { requestGetHistory } from "../../requests/homeRequests";
import MiniMap from "./MiniMap";
import { FaTrashCan } from "react-icons/fa6";
import { getTimePassed } from "../../helper/getTimePassed";
import { requestRemoveHistory } from "../../requests/homeRequests";

export default function SearchHistory({ user_id, markets, selectMarket, images }) {
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
        <div className='absolute z-0 bottom-[5%] left-[10%] flex flex-col w-1/3 h-2/3 text-black bg-darkoffwhite rounded-xl'>
            <p className='p-[3svh] text-[2.5svh] font-bold'>Search History:</p>
            <div className='flex flex-col w-full h-full p-[4%] gap-[5%] bg-offwhite overflow-scroll rounded-b-xl'>
                { history.map(hist => {
                    const market = markets.find(market => market.market_id === hist.market_id);
                    if (!market) return null;
                    const [time, entity] = getTimePassed(hist.hist_timestamp)
                    return (
                        <div key={market.market_id} className='flex w-full items-center justify-between pl-[2%] pr-[2%]'>
                            <MiniMap layout={market.map_layout} market={market} selectMarket={selectMarket} images={images}/>
                            <div className='flex items-center justify-center gap-[10%] w-[35%]'>
                                { market.market_image_url && 
                                <div className='flex items-center justify-center rounded-sm w-[2svw] h-[4svh] border-[0.5svh] border-darkgray-custom bg-gray-custom'>
                                    <img draggable='false' alt='' src={market.market_image_url}/>
                                </div>
                                }
                                <p className='font-bold'>{market.market_name}</p>
                            </div>
                            <p className='w-[20%]'>{time}{entity} ago</p>
                            <div className='flex items-center justify-center'>
                                <FaTrashCan onClick={() => removeHistory(market.market_id)} className='hover:text-purple-custom cursor-pointer'/>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}