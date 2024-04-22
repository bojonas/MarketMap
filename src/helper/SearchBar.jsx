import { useState } from 'react';
import { ButtonStyle } from './style';

export default function SearchBar({ onSearch }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <input
            className={`${ButtonStyle} w-[20rem] h-12 indent-2 text-lg`}
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
        />
    );
}