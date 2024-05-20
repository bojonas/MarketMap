import { useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch, onFocus, onBlur, placeholder }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value.toLowerCase());
    };

    return (
        <div className='flex items-center mt-[2svh] w-3/4 rounded-full bg-offwhite border-offwhite border-2 hover:border-darkgray-custom shadow-md'>
            <FaSearch className='w-[2.5svw] h-[2svh] ml-[0.2svw] text-black'/>
            <div className='bg-black h-3/5 w-[0.1svw] ml-[0.5svh]'/>
            <input className='bg-offwhite text-black indent-[1svw] rounded-r-full placeholder-slate-800 w-full h-[5svh] text-sm outline-none'
                type='text'
                value={search}
                onChange={handleSearch}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}/>
        </div>
    );
}