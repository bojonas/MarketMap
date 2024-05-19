import { useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch, onFocus, onBlur, placeholder }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value.toLowerCase());
    };

    return (
        <div className='relative inline-block mt-[4svh] text-center w-3/4'>
            <FaSearch style={{ 
                position: 'absolute', 
                width: '2.8svw',
                height: '2svh',
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'black' }}/>
            {null ? <div style={{ 
                position: 'absolute', 
                height: `2.5svh`,
                borderLeft: '1.5px solid white',
                marginLeft: `0.5svh`,
                top: '50%', 
                transform: 'translateY(-50%)' }}/> : null}
            <input
                className='custom-button bg-offwhite border-offwhite indent-[0.5svw] placeholder-slate-800 shadow-slate-700 w-full h-[5svh] pl-[3.5svh] text-[2svh]'
                type='text'
                value={search}
                onChange={handleSearch}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}/>
        </div>
    );
}