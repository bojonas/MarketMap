import React, { useState, useEffect } from "react";
import { requestGetMyMarket } from "../../requests/myMarketRequests";
import MapViewer from "../Home/MapViewer";
import MapEditor from "./MapEditor";
import { FaEdit } from "react-icons/fa";
import { MyMarketContext } from "../../DimensionContext";

export default function MyMarket() {
    const [market, setMarket] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const getMarkets = async () => {
          const data = await requestGetMyMarket(3);
          if (data) setMarket(data);
        }
        getMarkets();
    }, []);

    return (
        <MyMarketContext.Provider value={ market }>
            <div className='relative flex w-full h-full'>
                { market &&
                editMode ? <MapEditor market={market} setEditMode={setEditMode}/>
                : <React.Fragment>
                    <MapViewer market={market}/>
                    <div onClick={() => setEditMode(true)} className='absolute flex right-[2.5svw] top-[2.2svw] p-[1svh] pl-[2svh] pr-[2svh] hover:text-purple-custom hover:bg-gray-custom rounded-full cursor-pointer'>
                        <FaEdit size={24}/>
                        <p className='ml-[0.5svw]'>Edit</p>
                    </div>
                </React.Fragment>}
            </div>
        </MyMarketContext.Provider>
    );
}