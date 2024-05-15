import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import debounce from 'lodash.debounce';
import SearchBar from '../../atoms/SearchBar'
import { requestGetMarkets } from "../../requests/homeRequests";

export default function Home(){
    const [search, setSearch] = useState('');
    const [markets, setMarkets] = useState([]);
    const [filteredMarkets, setFilteredMarkets] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false); 
    const navigate = useNavigate();
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
        const results = markets.filter(({market_name, address, postal_code}) => 
            market_name.toLowerCase().includes(search.toLowerCase()) ||
            address.toLowerCase().includes(search.toLowerCase()) ||
            postal_code.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredMarkets(results);
    }, [search, markets]);

    const handleMarketClick = (market) => {
        navigate('/map', { state: { market: market } });
    }

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
        <div className='flex flex-col w-full h-full items-center'>
            <div className='flex flex-col items-center text-center w-1/2 h-fit'>
                <SearchBar onSearch={debouncedSearch} onFocus={handleOnFocus} onBlur={handleOnBlur}/>
                {searchClicked && <div className='p-1 w-[35svw] h-fit bg-[#4e4e4e7a] rounded-b-lg'>
                    {filteredMarkets.map((market, i) => (
                        <div key={i} onClick={() => handleMarketClick(market)} className='h-[8svh] p-4 flex gap-1 items-center bg-offwhite text-black border-gray-custom border-[0.4svh] rounded-lg hover:bg-white hover:cursor-pointer'>
                            <p className='font-bold'>{market.market_name}</p>
                            <p className='ml-4'>{market.address},</p>
                            <p>{market.postal_code},</p>
                            <p>{market.city},</p>
                            <p>{market.country}</p>
                        </div>
                    ))}
                </div>}
            </div>
        </div>
    );
}