import React, { useState, useEffect } from "react";
import { requestGetMarketZones, requestGetMyMarket } from "../../requests/myMarketRequests";
import MapViewer from "../Home/MapViewer";
import MapEditor from "./MapEditor";
import { FaEdit } from "react-icons/fa";
import { MyMarketContext } from "../../context/MyMarketContext";
import { MapLayout } from "./classes/MapLayout";

export default function MyMarket() {
    const user_id = localStorage.getItem('user_id');
    const [market, setMarket] = useState(null);
    const [mapLayout, setMapLayout] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (!user_id) return;
        const getMarket = async () => {
            const newMarket = await requestGetMyMarket(user_id);
            const zones = await requestGetMarketZones(user_id);
            if (!newMarket) return;
            setMarket(newMarket);
            if (!zones) return;
            const newLayout = newMarket.map_layout;
            const newMapLayout = new MapLayout(newLayout.length, newLayout[0].length)
            newMapLayout.build(newLayout, zones);
            setMapLayout(newMapLayout);
        }
        getMarket();
    }, [user_id]);
    
    return (
        <MyMarketContext.Provider value={{ market, mapLayout, setMapLayout }}>
            <div className='relative flex w-full h-full'>
                { !market ? null
                : editMode ? <MapEditor setEditMode={setEditMode}/>
                    : <React.Fragment>
                        <MapViewer market_name={market.market_name} market_image_url={market.market_image_url} mapLayout={mapLayout}/>
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