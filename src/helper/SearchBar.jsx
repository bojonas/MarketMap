import { useState } from 'react';

export default function SearchBar({ onSearch, scale }) {
    const [search, setSearch] = useState('');
    const SearchBarSize = scale*4;

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <input
            className={'custom-button indent-2 text-base placeholder-slate-200 shadow-slate-700'}
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search tools..."
            style={{
                width: `${SearchBarSize}px`,
                height: `${SearchBarSize/8}px`,
                fontSize: `${SearchBarSize/20.5}px`,
            }}
        />
    );
}