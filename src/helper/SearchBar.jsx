import { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <input
            className={'custom-button w-[20rem] h-12 indent-2 text-base placeholder-slate-200 shadow-slate-700'}
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search tools..."
        />
    );
}