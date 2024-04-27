import { useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch, scale, height, width }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className='relative inline-block' style={{marginTop: `${scale/35}px`}}>
            <FaSearch style={{ 
                position: 'absolute', 
                width: `${scale/15}px`,
                height: `${scale/42}px`,
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'white' }} />
            <input
                className='custom-button indent-2 placeholder-slate-200 shadow-slate-700'
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search items..."
                style={{
                    width: `${width/5}px`,
                    height: `${scale/17.5}px`,
                    fontSize: `${scale/45}px`,
                    paddingLeft: `${scale/22}px`
                }}
            />
        </div>
    );
}