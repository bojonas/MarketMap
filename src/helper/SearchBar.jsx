import { useState } from 'react';
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSearch, scale }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };
    
    return (
        <div className='relative inline-block'>
            <FaSearch style={{ position: 'absolute', left: `${scale/45}px`, top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
            <input
                className='custom-button indent-2 placeholder-slate-200 shadow-slate-700'
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search tools..."
                style={{
                    width: `${scale/2.2}px`,
                    height: `${scale/15}px`,
                    fontSize: `${scale/40}px`,
                    paddingLeft: '30px'
                }}
            />
        </div>
    );
}