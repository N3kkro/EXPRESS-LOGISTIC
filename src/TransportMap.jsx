import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './TransportMap.css';

// --- Translation Map for Buttons ---
const mapTranslations = {
  RU: {
    title: "География и маршруты",
    badge: "Направления",
    desc: "Наши специалисты глубоко знают специфику кросс-граничной логистики и нормативные требования стран-партнёров.",
    tmtm: "ТМТМ",
    export: "Экспорт",
    import: "Импорт",
    transit: "Транзит / Внутренние",
  },
  EN: {
    title: "Geography and Routes",
    badge: "Directions",
    desc: "Our specialists have deep knowledge of cross-border logistics and regulatory requirements of partner countries.",
    tmtm: "TMTM",
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

// --- 2. Master Coordinate Dictionary ---
const coords = {
  // Europe
  madrid: [-3.7038, 40.4168],
  nurnberg: [11.0767, 49.4521],
  duisburg: [6.7623, 51.4344],
  praga: [14.4378, 50.0755],
  northHungary: [19.0402, 47.4979], // Budapest
  bucharest: [26.1025, 44.4268],
  constanta: [28.6348, 44.1792],
  rome: [12.4964, 41.9028],
  // Caucasus & Turkey
  batumi: [41.6367, 41.6416],
  istanbul: [28.9784, 41.0082],
  ankara: [32.8597, 39.9334],
  mersin: [34.6415, 36.8121],
  baku: [49.8671, 40.4093],
  // Kazakhstan & Central Asia
  aktau: [51.1606, 43.6354],
  astana: [71.4460, 51.1294],
  almaty: [76.9286, 43.2220],
  tashkent: [69.2401, 41.2995],
  pavlodar: [76.9531, 52.2855],
  kokshetau: [69.3833, 53.2833],
  petropavlovsk: [69.1422, 54.8753],
  dostyk: [82.4833, 45.2500],
  altynkol: [80.4144, 44.2153], // Khorgos area
  // Iran & Middle East (Maritime/Land)
  benderEnzeli: [49.4609, 37.4746],
  tehran: [51.3890, 35.6892],
  serahs: [61.1604, 36.5449], // Sarakhs border
  benderAbbas: [56.2618, 27.1832],
  dubai: [55.2708, 25.2048],
  // South Asia Maritime
  karachi: [67.0011, 24.8607],
  mundra: [69.7353, 22.8398],
  // China & East Asia
  urumqi: [87.6168, 43.8256],
  xian: [108.9398, 34.3416],
  qingdao: [120.3826, 36.0671], // Cindao
  nanjing: [118.7969, 32.0603],
  chengdu: [104.0665, 30.5728],
  chongqing: [106.5516, 29.5630],
  shenzhen: [114.0579, 22.5431],
  ningbo: [121.5439, 29.8683],  // Ninbo
  pusan: [129.0756, 35.1795],   // Busan
  jinhua: [119.6495, 29.0791],
  // Legacy
  shanghai: [121.4737, 31.2304],
  moscow: [37.6173, 55.7558], 
  minsk: [27.5615, 53.9006],
  berlin: [13.4050, 52.5200], 
  warsaw: [21.0122, 52.2297]
};

// Nodes mapped dynamically
const cityGeoJSON = {
  type: "FeatureCollection",
  features: Object.keys(coords).map(key => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: coords[key] },
    properties: { 
      type: ['almaty', 'astana', 'baku', 'istanbul', 'xian', 'tehran'].includes(key) ? 'hub' : 'node', 
      name: key 
    }
  }))
};

const buildRouteGeoJSON = (paths) => {
  return {
    type: "FeatureCollection",
    features: paths.map(path => ({
      type: "Feature",
      geometry: { type: "LineString", coordinates: path }
    }))
  };
};

// --- 3. Generate Route Paths ---
const routeData = {
  export: buildRouteGeoJSON([
    // Europe to Black Sea
    generateCurve(coords.madrid, coords.nurnberg),
    generateCurve(coords.nurnberg, coords.duisburg),
    generateCurve(coords.nurnberg, coords.praga),
    generateCurve(coords.praga, coords.northHungary),
    generateCurve(coords.northHungary, coords.bucharest),
    generateCurve(coords.bucharest, coords.constanta),
    generateCurve(coords.constanta, coords.batumi),
    
    // Turkey Branches
    generateCurve(coords.batumi, coords.istanbul),
    generateCurve(coords.istanbul, coords.rome),
    generateCurve(coords.istanbul, coords.ankara),
    generateCurve(coords.ankara, coords.mersin),
    generateCurve(coords.mersin, coords.baku),
    
    // Caspian Sea & Kazakhstan
    generateCurve(coords.baku, coords.aktau),
    generateCurve(coords.aktau, coords.astana),
    generateCurve(coords.aktau, coords.almaty),
    generateCurve(coords.astana, coords.almaty),
    generateCurve(coords.astana, coords.tashkent),
    
    // Northern Kazakhstan Branches
    generateCurve(coords.astana, coords.dostyk),
    generateCurve(coords.astana, coords.pavlodar),
    generateCurve(coords.astana, coords.kokshetau),
    generateCurve(coords.kokshetau, coords.petropavlovsk),
    
    // Kazakhstan to China
    generateCurve(coords.dostyk, coords.altynkol),
    generateCurve(coords.dostyk, coords.urumqi),
    generateCurve(coords.urumqi, coords.xian),
    
    // China Internal & Maritime
    generateCurve(coords.xian, coords.qingdao),
    generateCurve(coords.xian, coords.nanjing),
    generateCurve(coords.xian, coords.chengdu),
    generateCurve(coords.xian, coords.chongqing),
    generateCurve(coords.xian, coords.shenzhen),
    generateCurve(coords.qingdao, coords.pusan),
    generateCurve(coords.qingdao, coords.ningbo),
    
    // The Middle East / South Asia Maritime Route
    generateCurve(coords.aktau, coords.benderEnzeli),
    generateCurve(coords.benderEnzeli, coords.tehran),
    generateCurve(coords.tehran, coords.benderAbbas),
    generateCurve(coords.tehran, coords.serahs),
    generateCurve(coords.benderAbbas, coords.dubai),
    generateCurve(coords.benderAbbas, coords.karachi),
    generateCurve(coords.karachi, coords.mundra),
    generateCurve(coords.mundra, coords.pusan), // Mega maritime route to Busan
    generateCurve(coords.mundra, coords.ningbo), // Mega maritime route to Ningbo
    generateCurve(coords.mundra, coords.qingdao) // Mega maritime route to Qingdao
  ]),
  tmtm: buildRouteGeoJSON([
generateCurve(coords.madrid, coords.nurnberg),
    // Nurnberg branches
    generateCurve(coords.nurnberg, coords.duisburg),
    generateCurve(coords.nurnberg, coords.praga),
    // Europe to Black Sea
    generateCurve(coords.praga, coords.northHungary),
    generateCurve(coords.northHungary, coords.bucharest),
    generateCurve(coords.bucharest, coords.constanta),
    generateCurve(coords.constanta, coords.batumi),
    generateCurve(coords.batumi, coords.istanbul),
    // Istanbul branches
    generateCurve(coords.istanbul, coords.rome),
    generateCurve(coords.istanbul, coords.ankara),
    // Turkey to Caspian
    generateCurve(coords.ankara, coords.mersin),
    generateCurve(coords.mersin, coords.baku),
    generateCurve(coords.baku, coords.aktau),
    // Aktau branches
    generateCurve(coords.aktau, coords.astana),
    generateCurve(coords.aktau, coords.almaty),
    // Kazakhstan to China
    generateCurve(coords.astana, coords.dostyk),
    generateCurve(coords.dostyk, coords.urumqi),
    generateCurve(coords.urumqi, coords.xian),
    // Xi'An branches to all major Chinese cities
    generateCurve(coords.xian, coords.qingdao),
    generateCurve(coords.xian, coords.nanjing),
    generateCurve(coords.xian, coords.chengdu),
    generateCurve(coords.xian, coords.chongqing),
    generateCurve(coords.xian, coords.shenzhen),
    // Nanjing to Jinhua
    generateCurve(coords.nanjing, coords.jinhua)
  ]),
  import: buildRouteGeoJSON([
    generateCurve([63.6333, 53.2167], coords.astana), // Kostanay to Astana
    generateCurve(coords.astana, coords.dostyk),      // Astana to Dostyk
    generateCurve(coords.dostyk, coords.almaty),      // Dostyk to Almaty
    generateCurve(coords.almaty, coords.aktau)        // Almaty to Aktau
  ])
};

export default function Map({ language }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  // Set default tab to Export for testing this huge network
  const [activeTab, setActiveTab] = useState('export');

  const t = mapTranslations[language] || mapTranslations.RU;

  maptilersdk.config.apiKey = 'LUiv1kgiHTN332fEPadc';

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: "base-v4", 
      center: [60.0000, 35.0000], // Shifted center slightly south-west to show Iran/India better
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
            'hub', 5,  
            'node', 3, 
            3
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
    <section className='routes-section'>
      <div className="routes-header">
        <span className="routes-badge">{t.badge}</span>
        <h2 className="routes-title">{t.title}</h2>
        <p className="routes-desc-top">{t.desc}</p>
      </div>
      <div className="map-wrap" style={{ position: 'relative', width: '100%', height: '100vh' }}>
        
        <div className="map-controls">
          <button className={activeTab === 'tmtm' ? 'active' : ''} onClick={() => setActiveTab('tmtm')}>
            {t.tmtm}
          </button>
          <button className={activeTab === 'export' ? 'active' : ''} onClick={() => setActiveTab('export')}>
            {t.export}
          </button>
          <button className={activeTab === 'import' ? 'active' : ''} onClick={() => setActiveTab('import')}>
            {t.import}
          </button>
        </div>
        <div ref={mapContainer} className="map" style={{ width: '100%', height: '100%' }} />
      </div>
    </section>
  );
}