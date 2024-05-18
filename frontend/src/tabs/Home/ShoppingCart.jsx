import SearchBar from "../../atoms/SearchBar";

export default function ShoppingCart() {
    const handleSearch = async () => {
        return;
    }
    return (
        <div className='flex flex-col items-center w-full h-full bg-purple-custom'>
            <SearchBar onSearch={handleSearch}></SearchBar>
        </div>
    );
}