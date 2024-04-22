import { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <input
            className="rounded-2xl bg-sky-950 w-full h-12 text-white indent-5 mb-1"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
        />
    );
}