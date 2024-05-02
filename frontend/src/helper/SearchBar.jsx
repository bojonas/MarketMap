import { useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch, scale }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className='relative inline-block mt-[4svh] text-center'>
            <FaSearch style={{ 
                position: 'absolute', 
                width: `${scale/1.5}px`,
                height: `${scale/4}px`,
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'white' }}/>
            <input
                className='custom-button indent-[0.5svw] placeholder-slate-200 shadow-slate-700 w-[15svw] h-[5svh] pl-[3.5svh]'
                style={{ fontSize: `${scale/4}px` }}
                type='text'
                value={search}
                onChange={handleSearch}
                placeholder='Search items...'/>
        </div>
    );
}