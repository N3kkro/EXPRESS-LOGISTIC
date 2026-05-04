import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './TransportMap.css';

export default function Map({ language }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  // Kazakhstan/Almaty coordinates
  const kazakhstan = { lng: 76.8512, lat: 43.2220 };
  const zoom = 4; // Lower zoom to see the whole country/region
  
  maptilersdk.config.apiKey = 'LUiv1kgiHTN332fEPadc';

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: "base-v4",
      center: [kazakhstan.lng, kazakhstan.lat],
      zoom: zoom
    });

    // Marker for the main logistics hub in Almaty
    new maptilersdk.Marker({color: "#2563eb"}) // Blue to match the logo style
      .setLngLat([76.8512, 43.2220])
      .addTo(map.current);
      
    new maptilersdk.Marker({color: "#00ff00b2"})
      .setLngLat([71.44667, 51.12938]) // Astana 
      .addTo(map.current);
  }, [kazakhstan.lng, kazakhstan.lat, zoom]);
  useEffect(() => {
    // Make sure the map exists before trying to change the language
    if (!map.current) return;

    // Determine the correct MapTiler language code
    const targetLang = language === 'RU' 
      ? maptilersdk.Language.RUSSIAN 
      : maptilersdk.Language.ENGLISH;

    // Apply the language to all map labels!
    map.current.setLanguage(targetLang);

  }, [language]);
  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}