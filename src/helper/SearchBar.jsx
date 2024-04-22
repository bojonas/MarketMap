import { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <input
            className="rounded-full bg-sky-950 w-[25rem] h-12 text-white indent-5 mb-1"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
        />
    );
}