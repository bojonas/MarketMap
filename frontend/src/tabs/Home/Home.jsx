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
                    <div className='flex flex-col items-center text-center w-1/2 h-fit'>
                        <SearchBar onSearch={debouncedSearch} onFocus={handleOnFocus} onBlur={handleOnBlur} placeholder={'Search markets...'}/>
                    </div>
                    { searchClicked && <div className='p-1 w-1/3 max-h-3/4 bg-[#4e4e4e7a] rounded-b-lg'>
                        { filteredMarkets.map((market, i) => (
                            <div key={i} onClick={() => setMarket(market)} 
                                className='h-[7svh] p-4 flex gap-1 items-center bg-offwhite text-black border-gray-custom border-[0.4svh] rounded-lg hover:bg-white hover:cursor-pointer'>
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