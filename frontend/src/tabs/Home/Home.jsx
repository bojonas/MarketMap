import React, { useEffect, useRef, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import SearchBar from '../../atoms/SearchBar'
import { requestGetMarkets, requestUpdateHistory } from "../../requests/homeRequests";
import MapViewer from "./MapViewer";
import SearchHistory from "./SearchHistory";
import ShoppingCarts from "./ShoppingCarts";
import { MapLayout } from '../MyMarket/classes/MapLayout';
import { requestGetMarketZones } from '../../requests/myMarketRequests';
import { findBorderCells } from '../MyMarket/findBorderCells';
import { getItemImages } from '../../helper/getItemImages';
import { removeCustomColors } from '../../helper/removeCustomColors';

export default function Home() {
    const user_id = localStorage.getItem('user_id');
    const images = getItemImages();
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
        removeCustomColors();
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
        if (!zones) return;

        const newLayout = market.map_layout;
        const newMapLayout = new MapLayout(newLayout.length, newLayout[0].length)
        newMapLayout.build(newLayout, zones);
        setMapLayout(newMapLayout);
        setMarket(market);

        document.documentElement.style.setProperty('--profile-color', '#171717');
        if (market.primary_market_color) document.documentElement.style.setProperty('--navbar-color', market.primary_market_color);
        if (market.primary_market_color) document.documentElement.style.setProperty('--navbar-border-color', market.primary_market_color);
        if (market.primary_market_color) document.documentElement.style.setProperty('--primary-color', market.primary_market_color);
        if (market.secondary_market_color) document.documentElement.style.setProperty('--secondary-color', market.secondary_market_color);
        if (!user_id) return;

        // update history 
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const timestamp = (new Date(now - offset)).toISOString().slice(0,-1);
        await requestUpdateHistory(timestamp, user_id, market.market_id);
    };

    const removeMarket = () => {
        setMarket(null)
        removeCustomColors();
    }

    const borderCells = useMemo(() => {
        const newBorderCells = new Map();
        if (!mapLayout) return newBorderCells;
        for (const zone of Array.from(mapLayout.zones.values())) {
            newBorderCells.set(zone.zone_id, { border: findBorderCells(zone.zone_layout), zone_color: zone.zone_color });
        }   
        return newBorderCells;
    }, [mapLayout]);

    return (
        <React.Fragment>
            { market ? <MapViewer market_name={market.market_name} market_image_url={market.market_image_url} mapLayout={mapLayout} removeMarket={removeMarket} borderCells={borderCells} images={images}/>
            : <div className='relative flex flex-col text-center w-full h-full'>
                <div className='flex flex-col text-center w-1/3 h-fit p-[2%] ml-[2%] pb-0'>
                    <SearchBar onSearch={debouncedSearch} onFocus={handleOnFocus} onBlur={handleOnBlur} placeholder={'Search markets...'} contrast='home'/>
                </div>
                { searchClicked && 
                    <div className='z-10 flex flex-col gap-[2%] ml-[3.55%] p-[1svh] w-[26%] max-h-[50svh] overflow-scroll bg-gray-button rounded-b-lg'>
                        { filteredMarkets.map((market, i) => (
                            <div key={i} onClick={() => selectMarket(market)} 
                                className={`h-[7svh] pt-[5%] pl-[3%] pb-[5%] gap-[1%] flex items-center text-[2svh] bg-darkgray-custom rounded-lg border-darkgray-custom border-l-[0.6svh] border-l-custom-hover hover:bg-gray-custom hover:cursor-pointer`}>
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
                    </div>
                }
                <SearchHistory user_id={user_id} markets={markets} selectMarket={selectMarket} images={images}/>
                <ShoppingCarts user_id={user_id}/>
            </div>}
        </React.Fragment>
    );
}