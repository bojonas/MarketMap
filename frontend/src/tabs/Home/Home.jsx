import React, { useEffect, useRef, useState } from "react";
import debounce from 'lodash.debounce';
import SearchBar from '../../atoms/SearchBar'
import { requestGetMarkets } from "../../requests/homeRequests";
import MapViewer from "./MapViewer";

export default function Home(){
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

    return (
        <React.Fragment>
            { market ? <MapViewer market={market}/>
            : <div className='flex w-full h-full justify-between'>
                <div className='flex flex-col items-center text-center w-full h-full'>
                    <div className='flex flex-col items-center text-center w-1/2 h-fit p-[2%] pb-0'>
                        <SearchBar onSearch={debouncedSearch} onFocus={handleOnFocus} onBlur={handleOnBlur} placeholder={'Search markets...'}/>
                    </div>
                    { searchClicked && <div className='flex flex-col gap-[0.5svh] p-[1svh] w-[32%] max-h-[50svh] overflow-scroll bg-darkoffwhite rounded-b-lg'>
                        { filteredMarkets.map((market, i) => (
                            <div key={i} onClick={() => setMarket(market)} 
                                className='h-[7svh] p-[1svw] flex gap-[2%] items-center text-black bg-offwhite rounded-lg border-[0.3svh] hover:border-purple-custom hover:bg-offwhite-hover hover:cursor-pointer'>
                                <p className='font-bold'>{market.market_name}</p>
                                <p className='ml-4'>{market.address},</p>
                                <p>{market.postal_code},</p>
                                <p>{market.city},</p>
                                <p>{market.country}</p>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>}
        </React.Fragment>
    );
}