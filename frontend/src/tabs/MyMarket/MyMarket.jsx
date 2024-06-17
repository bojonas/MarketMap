import React, { useState, useEffect, useMemo } from 'react';
import { requestGetMarketZones, requestGetMyMarket } from "../../requests/myMarketRequests";
import MapViewer from "../Home/MapViewer";
import MapEditor from "./MapEditor";
import { FaEdit } from "react-icons/fa";
import { MyMarketContext } from "../../context/MyMarketContext";
import { MapLayout } from "./classes/MapLayout";
import { getItemImages } from '../../helper/getItemImages';
import { findBorderCells } from "./findBorderCells";

export default function MyMarket() {
    const user_id = localStorage.getItem('user_id');
    const images = getItemImages();
    const [market, setMarket] = useState(null);
    const [mapLayout, setMapLayout] = useState(null);
    const [zones, setZones] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (!user_id) return;
        const getMarket = async () => {
            const newMarket = await requestGetMyMarket(user_id);
            if (!newMarket) return;

            if (newMarket.primary_market_color) document.documentElement.style.setProperty('--primary-color', newMarket.primary_market_color);
            if (newMarket.secondary_market_color) document.documentElement.style.setProperty('--secondary-color', newMarket.secondary_market_color);
            if (!user_id) return;
            const newZones = await requestGetMarketZones(newMarket.market_id);
            setMarket(newMarket);
            if (!newZones) return;

            setZones(newZones);
            const newLayout = newMarket.map_layout;
            const newMapLayout = new MapLayout(newLayout.length, newLayout[0].length);
            newMapLayout.build(newLayout, newZones);
            setMapLayout(newMapLayout);
        }
        getMarket();
    }, [user_id]);

    const borderCells = useMemo(() => {
        const newBorderCells = new Map();
        if (!mapLayout) return newBorderCells;

        for (const zone of Array.from(mapLayout.zones.values())) {
            newBorderCells.set(zone.zone_id, { border: findBorderCells(zone.zone_layout), zone_color: zone.zone_color });
        }   
        return newBorderCells;
    }, [mapLayout]);

    return (
        <MyMarketContext.Provider value={{ market, mapLayout, setMapLayout, zones, setZones, images, borderCells }}>
            <div className='relative flex w-full h-full'>
                { !market ? null
                : editMode ? <MapEditor setEditMode={setEditMode}/>
                    : <React.Fragment>
                        <MapViewer market_name={market.market_name} market_image_url={market.market_image_url} mapLayout={mapLayout} borderCells={borderCells} images={images}/>
                        <div onClick={() => setEditMode(true)} className='absolute flex right-[6.5svw] top-[3svw] text-primary-hover cursor-pointer'>
                            <FaEdit size={24}/>
                            <p className='ml-[0.5svw]'>Edit</p>
                        </div>
                    </React.Fragment>
                }
            </div>
        </MyMarketContext.Provider>
    );
}