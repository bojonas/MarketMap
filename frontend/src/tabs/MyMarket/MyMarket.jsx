import React, { useState, useEffect } from "react";
import { requestGetMarketZones, requestGetMyMarket } from "../../requests/myMarketRequests";
import MapViewer from "../Home/MapViewer";
import MapEditor from "./MapEditor";
import { FaEdit } from "react-icons/fa";
import { MyMarketContext } from "../../context/MyMarketContext";
import { MapLayout } from "./classes/MapLayout";
import { getItemImages } from '../../helper/getItemImages';
import ZoneCreator from "./ZoneCreator";
import { findBorderCells } from "./findBorderCells";

export default function MyMarket() {
    const user_id = localStorage.getItem('user_id');
    const images = getItemImages();
    const [market, setMarket] = useState(null);
    const [mapLayout, setMapLayout] = useState(null);
    const [zones, setZones] = useState([]);
    const [borderCells, setBorderCells] = useState(new Map());
    const [editMode, setEditMode] = useState(false);
    const [addZone, setAddZone] = useState(false);

    useEffect(() => {
        if (!user_id) return;
        const getMarket = async () => {
            const newMarket = await requestGetMyMarket(user_id);
            if (!newMarket) return;
            const newZones = await requestGetMarketZones(newMarket.market_id);
            setMarket(newMarket);
            if (!newZones) return;

            setZones(newZones);
            const newLayout = newMarket.map_layout;
            const newMapLayout = new MapLayout(newLayout.length, newLayout[0].length)
            newMapLayout.build(newLayout, newZones);
            setMapLayout(newMapLayout);
            const newBorderCells = new Map();
            for (const zone of newZones) {
                newBorderCells.set(zone.zone_id, { border: findBorderCells(zone.zone_layout), zone_color: zone.zone_color });
            }   
            setBorderCells(newBorderCells);
        }
        getMarket();
    }, [user_id]);

    return (
        <MyMarketContext.Provider value={{ market, mapLayout, setMapLayout, zones, images, borderCells, addZone, setAddZone }}>
            <div className='relative flex w-full h-full'>
                { !market ? null
                : editMode ? addZone ? <ZoneCreator setAddZone={setAddZone}/> : <MapEditor setEditMode={setEditMode}/>
                    : <React.Fragment>
                        <MapViewer market_name={market.market_name} market_image_url={market.market_image_url} mapLayout={mapLayout} borderCells={borderCells} images={images}/>
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