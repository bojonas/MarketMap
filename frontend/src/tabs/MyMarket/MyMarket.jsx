import React, { useState, useEffect } from "react";
import { requestGetMyMarket } from "../../requests/myMarketRequests";
import MapViewer from "../Home/MapViewer";
import MapEditor from "./MapEditor";
import { FaEdit } from "react-icons/fa";
import { MyMarketContext } from "../../DimensionContext";

export default function MyMarket() {
    const user_id = localStorage.getItem('user_id');
    const [market, setMarket] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (!user_id) return;
        const getMarkets = async () => {
          const data = await requestGetMyMarket(user_id);
          if (data) setMarket(data);
        }
        getMarkets();
    }, [user_id]);
    return (
        <MyMarketContext.Provider value={ market }>
            <div className='relative flex w-full h-full'>
                { !market ? null
                : editMode ? <MapEditor setEditMode={setEditMode}/>
                    : <React.Fragment>
                        <MapViewer market={market}/>
                        <div onClick={() => setEditMode(true)} className='absolute flex right-[6.5svw] top-[3svw] hover:text-purple-custom cursor-pointer'>
                            <FaEdit size={24}/>
                            <p className='ml-[0.5svw]'>Edit</p>
                        </div>
                    </React.Fragment>
                }
            </div>
        </MyMarketContext.Provider>
    );
}