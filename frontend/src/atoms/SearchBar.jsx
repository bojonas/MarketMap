import React, { useMemo, useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch, onFocus, onBlur, placeholder, contrast='black' }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value.toLowerCase());
    };

    const divStyle = useMemo(() => ({ 
        black: 'flex items-center mt-[2svh] w-3/4 rounded-full bg-offwhite border-offwhite border-[0.4svh] border-secondary-hover shadow-md',
        purple: 'flex items-center mt-[2svh] w-3/4 rounded-full bg-offwhite border-offwhite border-[0.4svh] border-secondary-hover shadow-md',
        home: 'flex items-center mt-[2svh] w-full rounded-full bg-gray-custom border-gray-custom border-[0.4svh] border-custom-hover shadow-md',
    }), []);
    const inputStyle = useMemo(() => ({
        black: 'bg-offwhite text-black indent-[1svw] rounded-r-full placeholder-slate-800 w-full h-[5svh] text-sm outline-none',
        purple: 'bg-offwhite text-black indent-[1svw] rounded-r-full placeholder-slate-800 w-full h-[5svh] text-sm outline-none',
        home: 'bg-gray-custom indent-[1svw] rounded-r-full placeholder-offwhite w-full h-[5.8svh] text-sm outline-none',
    }), [])
    const faSearchStyle = useMemo(() => ({
        black: 'w-[2.5svw] h-[2.2svh] ml-[0.3svw] text-black',
        purple: 'w-[2.5svw] h-[2.2svh] ml-[0.3svw] text-black',
        home: 'w-[3svw] h-[2.5svh] ml-[0.5svw]',
    }), [])
    const strokeStyle = useMemo(() => ({
        black: 'bg-black h-3/5 w-[0.12svw] ml-[0.5svh]',
        purple: 'bg-black h-3/5 w-[0.12svw] ml-[0.5svh]',
        home: 'bg-custom h-3/5 w-[0.15svw] ml-[0.5svh]',
    }), [])

    return (
        <React.Fragment>
            {<div className={divStyle[contrast]}>
                <FaSearch className={faSearchStyle[contrast]}/>
                <div className={strokeStyle[contrast]}/>
                <input 
                    name='searchbar'
                    className={inputStyle[contrast]}
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