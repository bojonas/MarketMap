import { useState } from 'react';

export default function SearchBar({ onSearch, scale }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };
    
    return (
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
            }}
        />
    );
}