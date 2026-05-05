import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './TransportMap.css';

// --- Translation Map for Buttons ---
const mapTranslations = {
  RU: {
    export: "Экспорт",
    import: "Импорт",
    transit: "Транзит / Внутренние"
  },
  EN: {
    export: "Export",
    import: "Import",
    transit: "Transit / Internal"
  }
};

// --- 1. Helper Function: Creates an arched curve between two points ---
const generateCurve = (start, end) => {
  const points = [];
  const numPoints = 50; 
  
  const midLng = (start[0] + end[0]) / 2;
  const midLat = (start[1] + end[1]) / 2;
  
  const distance = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
  
  const controlLng = midLng;
  const controlLat = midLat + (distance * 0.15); 

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lng = Math.pow(1 - t, 2) * start[0] + 2 * (1 - t) * t * controlLng + Math.pow(t, 2) * end[0];
    const lat = Math.pow(1 - t, 2) * start[1] + 2 * (1 - t) * t * controlLat + Math.pow(t, 2) * end[1];
    points.push([lng, lat]);
  }
  return points;
};

// --- 2. Define Key Cities (Dots) based on your text ---
const cities = [
  // Kazakhstan & Central Asia
  { name: 'Almaty', coords: [76.9286, 43.2220], type: 'hub' },
  { name: 'Astana', coords: [71.4460, 51.1294], type: 'hub' },
  { name: 'Khorgos', coords: [80.4144, 44.2153], type: 'node' },
  { name: 'Aktau', coords: [51.1606, 43.6354], type: 'node' },
  { name: 'Tashkent', coords: [69.2401, 41.2995], type: 'node' },
  // EAEU
  { name: 'Moscow', coords: [37.6173, 55.7558], type: 'hub' },
  { name: 'Minsk', coords: [27.5615, 53.9006], type: 'node' },
  // China
  { name: 'Beijing', coords: [116.4074, 39.9042], type: 'hub' },
  { name: 'Shanghai', coords: [121.4737, 31.2304], type: 'node' },
  { name: 'Urumqi', coords: [87.6168, 43.8256], type: 'node' },
  // Europe
  { name: 'Berlin', coords: [13.4050, 52.5200], type: 'hub' },
  { name: 'Warsaw', coords: [21.0122, 52.2297], type: 'node' },
  { name: 'Madrid', coords: [-3.7038, 40.4168], type: 'node' },
];

const cityGeoJSON = {
  type: "FeatureCollection",
  features: cities.map(city => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: city.coords },
    properties: { type: city.type, name: city.name }
  }))
};

// --- 3. Generate Route Paths ---
const coords = {
  almaty: [76.9286, 43.2220], astana: [71.4460, 51.1294],
  beijing: [116.4074, 39.9042], shanghai: [121.4737, 31.2304], urumqi: [87.6168, 43.8256],
  moscow: [37.6173, 55.7558], minsk: [27.5615, 53.9006],
  berlin: [13.4050, 52.5200], warsaw: [21.0122, 52.2297], madrid: [-3.7038, 40.4168],
  tashkent: [69.2401, 41.2995]
};

const buildRouteGeoJSON = (paths) => {
  return {
    type: "FeatureCollection",
    features: paths.map(path => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: path
      }
    }))
  };
};

const routeData = {
  export: buildRouteGeoJSON([
    generateCurve(coords.beijing, coords.astana),
    generateCurve(coords.astana, coords.moscow),
    generateCurve(coords.moscow, coords.berlin),
    generateCurve(coords.shanghai, coords.urumqi),
    generateCurve(coords.urumqi, coords.almaty)
  ]),
  transit: buildRouteGeoJSON([
    generateCurve(coords.berlin, coords.warsaw),
    generateCurve(coords.warsaw, coords.minsk),
    generateCurve(coords.minsk, coords.astana),
    generateCurve(coords.astana, coords.almaty),
    generateCurve(coords.almaty, coords.tashkent)
  ]),
  import: buildRouteGeoJSON([
    generateCurve(coords.madrid, coords.berlin),
    generateCurve(coords.berlin, coords.moscow),
    generateCurve(coords.moscow, coords.almaty),
    generateCurve(coords.almaty, coords.urumqi)
  ])
};

export default function Map({ language }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [activeTab, setActiveTab] = useState('export');

  // Select the correct dictionary based on the language prop
  const t = mapTranslations[language] || mapTranslations.RU;

  maptilersdk.config.apiKey = 'LUiv1kgiHTN332fEPadc';

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: "base-v4", 
      center: [76.9286, 43.2220],
      zoom: 3,
      pitch: 40, 
    });

    map.current.on('load', () => {
      map.current.addSource('route-source', {
        type: 'geojson',
        data: routeData[activeTab]
      });

      map.current.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#3b82f6', 
          'line-width': 2.5,
          'line-opacity': 0.7,
          'line-dasharray': [2, 2] 
        }
      });

      map.current.addSource('city-source', {
        type: 'geojson',
        data: cityGeoJSON
      });

      map.current.addLayer({
        id: 'city-dots',
        type: 'circle',
        source: 'city-source',
        paint: {
          'circle-radius': [
            'match', ['get', 'type'],
            'hub', 6,  
            'node', 4, 
            4
          ],
          'circle-color': [
            'match', ['get', 'type'],
            'hub', '#ffffff', 
            'node', '#93c5fd', 
            '#93c5fd'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#1d4ed8' 
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;
    const source = map.current.getSource('route-source');
    if (source) {
      source.setData(routeData[activeTab]);
    }
  }, [activeTab]);

  return (
    <div className="map-wrap" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div className="map-controls">
        {/* Buttons now use the 't' object for translation */}
        <button className={activeTab === 'export' ? 'active' : ''} onClick={() => setActiveTab('export')}>
          {t.export}
        </button>
        <button className={activeTab === 'import' ? 'active' : ''} onClick={() => setActiveTab('import')}>
          {t.import}
        </button>
        <button className={activeTab === 'transit' ? 'active' : ''} onClick={() => setActiveTab('transit')}>
          {t.transit} 
        </button>
      </div>
      <div ref={mapContainer} className="map" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}