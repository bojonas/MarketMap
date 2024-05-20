export default function Switch({setMode, mode}){
    const handleSwitchChange = ()=>{setMode(!mode)}

    return (
        <div className="flex flex-col items-center justify-center">
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={mode} onChange={handleSwitchChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
            <h4 className="mt-4">{mode ? 'Privat' : 'Markt'}</h4>
        </div>
    )
}

