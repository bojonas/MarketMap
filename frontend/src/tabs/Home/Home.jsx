import React, { useEffect, useRef, useState } from "react";
import debounce from 'lodash.debounce';
import SearchBar from '../../atoms/SearchBar'
import { requestGetMarkets, requestUpdateHistory } from "../../requests/homeRequests";
import MapViewer from "./MapViewer";
import SearchHistory from "./SearchHistory";
import ShoppingCarts from "./ShoppingCarts";

export default function Home(){
    const user_id = localStorage.getItem('user_id');
    const [search, setSearch] = useState('');
    const [markets, setMarkets] = useState([]);
    const [market, setMarket] = useState(null)
    const [filteredMarkets, setFilteredMarkets] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false); 
    const timeoutId = useRef();

    const debouncedSearch = debounce(value => {
        setSearch(value);
    }, 200);

    useEffect(() => {
        const getMarkets = async () => {
          const data = await requestGetMarkets();
          if (data) setMarkets(data);
        }
        getMarkets();
    }, []);

    useEffect(() => {
        const results = markets.filter(({ market_name, address, postal_code, city, country }) => 
            market_name.toLowerCase().includes(search) ||
            address.toLowerCase().includes(search) ||
            postal_code.toLowerCase().includes(search) ||
            city.toLowerCase().includes(search) ||
            country.toLowerCase().includes(search)
        );
        setFilteredMarkets(results);
    }, [search, markets]);

    const handleOnFocus = () => {
        setSearchClicked(prevsearchClicked => !prevsearchClicked);
    }

    const handleOnBlur = () => {
        timeoutId.current = setTimeout(() => {
            setSearchClicked(prevsearchClicked => !prevsearchClicked);
        }, 200);
    }

    // clear timeout
    useEffect(() => {
        return () => {
            clearTimeout(timeoutId.current);
        }
    }, []);

    // update history when a market is opened
    useEffect(() => {
        if (!market || !user_id) return;
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const timestamp = (new Date(now - offset)).toISOString().slice(0,-1);
        requestUpdateHistory(timestamp, user_id, market.market_id);
    }, [market, user_id]);

    return (
        <React.Fragment>
            { market ? <MapViewer market={market}/>
            : <div className='relative flex flex-col items-center text-center w-full h-full'>
                <div className='flex flex-col items-center text-center w-1/2 h-fit p-[2%] pb-0'>
                    <SearchBar onSearch={debouncedSearch} onFocus={handleOnFocus} onBlur={handleOnBlur} placeholder={'Search markets...'}/>
                </div>
                { searchClicked && <div className='z-10 flex flex-col gap-[0.5svh] p-[1svh] w-[32%] max-h-[50svh] overflow-scroll bg-darkoffwhite rounded-b-lg'>
                    { filteredMarkets.map((market, i) => (
                        <div key={i} onClick={() => setMarket(market)} 
                            className='h-[7svh] p-[5%] flex gap-[2%] items-center text-black text-[2svh] bg-offwhite rounded-lg border-[0.3svh] hover:border-purple-custom hover:bg-offwhite-hover hover:cursor-pointer'>
                            {'market_image_url' in market && <div className='rounded-lg p-[5%] mr-[2%] bg-gray-custom border-darkgray-custom border-[0.4svh]'></div>}
                            <p className=' ont-bold'>{market.market_name}</p>
                            <p className='ml-[4%]'>{market.address},</p>
                            <p>{market.postal_code},</p>
                            <p>{market.city},</p>
                            <p>{market.country}</p>
                        </div>
                    ))}
                </div>}
                <SearchHistory user_id={user_id} markets={markets} setMarket={setMarket}/>
                <ShoppingCarts/>
            </div>}
        </React.Fragment>
    );
}