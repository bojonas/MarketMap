import React, { useMemo, useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch, onFocus, onBlur, placeholder, contrast='black' }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value.toLowerCase());
    };

    const divStyle = useMemo(() => ({ 
        black: 'flex items-center mt-[2svh] w-3/4 rounded-full bg-offwhite border-offwhite border-[0.4svh] hover:border-purple-custom shadow-md',
        purple: 'flex items-center mt-[2svh] w-3/4 rounded-full bg-offwhite border-offwhite border-[0.4svh] hover:border-darkgray-custom shadow-md'
    }), []);
    const inputStyle = useMemo(() => ({
        black: 'bg-offwhite text-black indent-[1svw] rounded-r-full placeholder-slate-800 w-full h-[5svh] text-sm outline-none',
        purple: 'bg-offwhite text-black indent-[1svw] rounded-r-full placeholder-slate-800 w-full h-[5svh] text-sm outline-none'
    }), [])

    return (
        <React.Fragment>
            {<div className={divStyle[contrast]}>
                <FaSearch className='w-[2.5svw] h-[2svh] ml-[0.2svw] text-black'/>
                <div className='bg-black h-3/5 w-[0.1svw] ml-[0.5svh]'/>
                <input className={inputStyle[contrast]}
                    type='text'
                    value={search}
                    onChange={handleSearch}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={placeholder}/>
            </div>}
        </React.Fragment>
    );
}