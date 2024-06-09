import React, { useEffect, useRef, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import SearchBar from '../../atoms/SearchBar'
import { requestGetMarkets, requestUpdateHistory } from "../../requests/homeRequests";
import MapViewer from "./MapViewer";
import SearchHistory from "./SearchHistory";
import ShoppingCarts from "./ShoppingCarts";
import { MapLayout } from '../MyMarket/classes/MapLayout';
import { requestGetMarketZones } from '../../requests/myMarketRequests';

export default function Home() {
    const user_id = localStorage.getItem('user_id');
    const [search, setSearch] = useState('');
    const [markets, setMarkets] = useState([]);
    const [market, setMarket] = useState(null);
    const [mapLayout, setMapLayout] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false); 
    const timeoutId = useRef();
    
    useEffect(() => {
        const getMarkets = async () => {
            const data = await requestGetMarkets();
            if (data) setMarkets(data);
        }
        getMarkets();
    }, []);
    
    const filteredMarkets = useMemo(() => {
        return markets.filter(({ market_name, address, postal_code, city, country }) => 
            market_name.toLowerCase().includes(search) ||
            address.toLowerCase().includes(search) ||
            postal_code.toLowerCase().includes(search) ||
            city.toLowerCase().includes(search) ||
            country.toLowerCase().includes(search)
        );
    }, [search, markets]);
    
    const handleOnFocus = () => {
        setSearchClicked(prevsearchClicked => !prevsearchClicked);
    }

    const handleOnBlur = () => {
        timeoutId.current = setTimeout(() => {
            setSearchClicked(prevsearchClicked => !prevsearchClicked);
        }, 200);
    }

    const debouncedSearch = debounce(value => {
        setSearch(value);
    }, 200);

    // clear timeout
    useEffect(() => {
        return () => {
            clearTimeout(timeoutId.current);
        }
    }, []);

    const selectMarket = async (market) => {
        const zones = await requestGetMarketZones(market.market_id);
        setMarket(market);
        if (!zones) return;

        const newLayout = market.map_layout;
        const newMapLayout = new MapLayout(newLayout.length, newLayout[0].length)
        newMapLayout.build(newLayout, zones);
        setMapLayout(newMapLayout);
        if (!user_id) return;

        // update history 
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const timestamp = (new Date(now - offset)).toISOString().slice(0,-1);
        await requestUpdateHistory(timestamp, user_id, market.market_id);
    };

    return (
        <React.Fragment>
            { market ? <MapViewer market_name={market.market_name} market_image_url={market.market_image_url} mapLayout={mapLayout} setMarket={setMarket}/>
            : <div className='relative flex flex-col items-center text-center w-full h-full'>
                <div className='flex flex-col items-center text-center w-2/5 h-fit p-[2%] pb-0'>
                    <SearchBar onSearch={debouncedSearch} onFocus={handleOnFocus} onBlur={handleOnBlur} placeholder={'Search markets...'}/>
                </div>
                { searchClicked && <div className='z-10 flex flex-col gap-[1%] p-[1svh] w-[24%] max-h-[50svh] overflow-scroll bg-darkoffwhite rounded-b-lg'>
                    { filteredMarkets.map((market, i) => (
                        <div key={i} onClick={() => selectMarket(market)} 
                            className='h-[7svh] pt-[5%] pl-[3%] pb-[5%] gap-[1%] flex items-center text-black text-[2svh] bg-offwhite rounded-lg border-offwhite border-l-[0.6svh] hover:border-l-purple-custom hover:bg-offwhite-hover hover:cursor-pointer'>
                            <div className='flex items-center w-[40%] h-full gap-[6%]'>
                                { market.market_image_url && 
                                    <div className='flex items-center justify-center rounded-sm w-[2svw] h-[4svh] bg-gray-custom border-darkgray-custom border-[0.5svh]'>
                                        <img draggable='false' alt='' src={market.market_image_url}/>
                                    </div>
                                }
                                <p className='font-bold text-[2.1svh]'>{market.market_name}</p>
                            </div>
                            <p className='ml-[3%]'>{market.address},</p>
                            <p>{market.postal_code}</p>
                        </div>
                    ))}
                </div>}
                <SearchHistory user_id={user_id} markets={markets} selectMarket={selectMarket}/>
                <ShoppingCarts user_id={user_id}/>
            </div>}
        </React.Fragment>
    );
}