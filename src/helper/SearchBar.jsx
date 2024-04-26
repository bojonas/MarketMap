import { useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch, scale, width}) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className='relative inline-block'>
            <FaSearch style={{ 
                position: 'absolute', 
                width: `${scale/1.6}px`,
                height: `${scale/4.5}px`, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'white' }} />
            <input
                className='custom-button indent-2 placeholder-slate-200 shadow-slate-700'
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search tools..."
                style={{
                    width: `${width/5}px`,
                    height: `${scale/1.7}px`,
                    fontSize: `${scale/5}px`,
                    paddingLeft: `${scale/2.2}px`
                }}
            />
        </div>
    );
}