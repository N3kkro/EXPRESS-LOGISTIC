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

// --- 1. Helper Functions ---

// A. Mathematical curve for long "flying" routes
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
// This function takes as many path segments as you want and glues them together
const combinePaths = (...segments) => {
  // .flat(1) takes all the separate arrays of points and flattens them into one single continuous line
  return segments.flat(1);
};
//Parabolla
const generateParabolaMinus = (start, end) => {
  const points = [];
  const numPoints = 50; 
  
  // 1. Find the distance between the two points to determine how high to arch
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 2. Set the maximum height of the arc (adjust 0.15 to make it taller or flatter)
  const arcHeight = distance * -0.15; 

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints; // 't' goes from 0.0 (start) to 1.0 (end)

    // 3. Calculate the straight-line path (Linear Interpolation)
    const baseLng = start[0] + (dx * t);
    const baseLat = start[1] + (dy * t);

    // 4. Calculate the Parabolic Offset
    // The formula 4 * h * t * (1 - t) guarantees a perfect parabola that is 
    // exactly 0 at the start, hits 'arcHeight' in the dead center, and is 0 at the end.
    const parabolicOffset = 4 * arcHeight * t * (1 - t);

    // 5. Apply the upward bend to the Latitude
    const lng = baseLng;
    const lat = baseLat + parabolicOffset;

    points.push([lng, lat]);
  }
  
  return points;
};
const generateParabollaPlus = (start, end) => {
  const points = [];
  const numPoints = 50; 
  
  // 1. Find the distance between the two points to determine how high to arch
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 2. Set the maximum height of the arc (adjust 0.15 to make it taller or flatter)
  const arcHeight = distance * 0.15; 

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints; // 't' goes from 0.0 (start) to 1.0 (end)

    // 3. Calculate the straight-line path (Linear Interpolation)
    const baseLng = start[0] + (dx * t);
    const baseLat = start[1] + (dy * t);

    // 4. Calculate the Parabolic Offset
    // The formula 4 * h * t * (1 - t) guarantees a perfect parabola that is 
    // exactly 0 at the start, hits 'arcHeight' in the dead center, and is 0 at the end.
    const parabolicOffset = 4 * arcHeight * t * (1 - t);

    // 5. Apply the upward bend to the Latitude
    const lng = baseLng;
    const lat = baseLat + parabolicOffset;

    points.push([lng, lat]);
  }
  
  return points;
};
//MORE CURVED PARABOLA
const generateSmartCurve = (start, end, bendIntensity = 0.15, bendRight = true) => {
  const points = [];
  const numPoints = 50; 
  
  // 1. Get the distance
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 2. Find the Perpendicular direction (This is the magic part!)
  // This calculates exactly which way is "sideways" compared to the line
  let normalX = -dy / distance;
  let normalY = dx / distance;

  // Swap direction if we want it to bend the other way
  if (!bendRight) {
    normalX = -normalX;
    normalY = -normalY;
  }

  // Set how wide the bend should be
  const arcHeight = distance * bendIntensity; 

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;

    // Base straight line
    const baseLng = start[0] + (dx * t);
    const baseLat = start[1] + (dy * t);

    // Parabola math
    const parabolicOffset = 4 * arcHeight * t * (1 - t);

    // Apply the offset sideways (perpendicular to the line)
    const lng = baseLng + (normalX * parabolicOffset);
    const lat = baseLat + (normalY * parabolicOffset);

    points.push([lng, lat]);
  }
  
  return points;
};
//S curve
const generateSmartSCurve = (start, end, bendIntensity = 0.15, invert = false) => {
  const points = [];
  const numPoints = 50; 
  
  // 1. Get the distance
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 2. Find the Perpendicular direction (sideways)
  let normalX = -dy / distance;
  let normalY = dx / distance;

  // Swap direction if we want the "S" to start bending the opposite way
  if (invert) {
    normalX = -normalX;
    normalY = -normalY;
  }

  // Set how wide the "S" should bulge
  const waveHeight = distance * bendIntensity; 

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;

    // Base straight line
    const baseLng = start[0] + (dx * t);
    const baseLat = start[1] + (dy * t);

    // S-Curve Math (Sine Wave)
    // t * Math.PI * 2 creates exactly one full "S" wave from start to finish!
    const sOffset = Math.sin(t * Math.PI * 2) * waveHeight;

    // Apply the offset sideways (perpendicular to the line)
    const lng = baseLng + (normalX * sOffset);
    const lat = baseLat + (normalY * sOffset);

    points.push([lng, lat]);
  }
  
  return points;
};


// B. NEW: Custom path for realistic, uneven routing using waypoints
const customPath = (pointsArray) => {
  return pointsArray; 
};

// --- 2. Master Coordinate Dictionary ---
const coords = {
  // Europe
  madrid: [-3.7038, 40.4168],
  nurnberg: [11.0767, 49.4521],
  duisburg: [6.7623, 51.4344],
  praga: [14.4378, 50.0755],
  northHungary: [19.0402, 47.4979],
  bucharest: [26.1025, 44.4268],
  constanta: [28.6348, 44.1792],
  rome: [12.4964, 41.9028],
  // Caucasus & Turkey
  batumi: [41.6367, 41.6416],
  istanbul: [28.9784, 41.0082],
  ankara: [32.8597, 39.9334],
  mersin: [34.6415, 36.8121],
  baku: [49.8671, 40.4093],
  
  // KAZAKHSTAN & CENTRAL ASIA (Including new transit waypoints from your image)
  aktau: [51.1606, 43.6354],
  astana: [71.4460, 51.1294],
  almaty: [76.9286, 43.2220],
  tashkent: [69.2401, 41.2995],
  pavlodar: [76.9531, 52.2855],
  petropavlovsk: [69.1422, 54.8753],
  kokshetau: [69.3833, 53.2833],
  kostanay: [63.6283, 53.2198],
  dostyk: [82.4833, 45.2500],
  altynkol: [80.4144, 44.2153],
  
  // NEW: Waypoints for realistic paths
  esil: [66.3966, 51.9559],
  makinsk: [70.4131, 52.6294],
  karagandy: [73.0858, 49.8066],
  balkhash: [74.3222, 46.8402],
  ushtobe: [77.9818, 45.2509],
  shu: [73.7613, 43.5983],
  kyzylorda: [65.5092, 44.8486],
  aral: [61.6425, 46.7994],
  shalqar: [59.6050, 47.8336],
  aktobe: [57.1467, 50.2839],
  beyneu: [55.2930, 45.3217],

  // Iran & Middle East
  benderEnzeli: [49.4609, 37.4746],
  tehran: [51.3890, 35.6892],
  serahs: [61.1604, 36.5449],
  benderAbbas: [56.2618, 27.1832],
  dubai: [55.2708, 25.2048],
  karachi: [67.0011, 24.8607],
  mundra: [69.7353, 22.8398],
  
  // China & East Asia
  urumqi: [87.6168, 43.8256],
  xian: [108.9398, 34.3416],
  qingdao: [120.3826, 36.0671],
  nanjing: [118.7969, 32.0603],
  chengdu: [104.0665, 30.5728],
  chongqing: [106.5516, 29.5630],
  shenzhen: [114.0579, 22.5431],
  ningbo: [121.5439, 29.8683],
  pusan: [129.0756, 35.1795],
  jinhua: [119.6495, 29.0791]
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
    combinePaths(
      generateSmartCurve([50.541536, 44.526817], [53.640584, 47.015663], 0.3, false),
      generateSmartCurve([53.640584, 47.015663],[53.545625,48.01616 ], 0.5,),
      customPath([[53.545625,48.01616 ],[56.168233, 50.236927]]),
      customPath([[56.168233, 50.236927],[61.337881,50.55604]]),
      // ? + qostanay 
      generateSmartCurve([61.337881,50.55604],[63.786437,53.062745], 0.1,false,),
      //
      generateSmartCurve([63.786437,53.062745],[71.484191, 51.181217], 0.1,false,),
      generateSmartSCurve([71.484191, 51.181217],[74.502678, 47.664885], 0.1,),
      customPath([[74.502678, 47.664885],[ 82.231686,45.584742 ]]),
      generateSmartCurve([ 82.231686,45.584742 ],[92.984705, 38.198103 ]),
      customPath([[92.984705, 38.198103 ],[96.382034, 37.963486]]),
      customPath([[96.382034, 37.963486],[98.306212, 37.466704 ]]),
      customPath([[98.306212, 37.466704 ],[112.73333,37.683331 ]]),
      //chinjao to zhuozhuo
      customPath([[112.73333,37.683331 ], [115.95019, 39.486801]]),
      //zhuozhuo to beijing
      customPath([[115.95019, 39.486801],[116.4081,39.869878]])
    ),
    //chinjao line to cindao
      combinePaths(
        customPath([[112.73333,37.683331],[116.408207, 36.442327]]),
        generateSmartCurve([116.408207, 36.442327], [120.331484, 36.192268 ], 0.1, false)
      ),
    //line to tjanzin
      generateSmartCurve([115.95019, 39.486801],[117.345629, 39.143267],0.1,false),
    //Republic china to chendu
    combinePaths(
      customPath([[96.382034, 37.963486],[104.0633,30.6618]],),
      generateSmartCurve([104.0633,30.6618],[105.0200,30.5618],0.1, false),
      customPath([[105.0200,30.5618],[114.267, 30.5833]]),
      customPath([[114.267, 30.5833],[120.156184,30.799485 ]]),
      generateSmartCurve([120.156184,30.799485 ],[121.745124,31.222096 ], 0.1, false)
    ),
    //Other side from china republic
    combinePaths(
      customPath([[92.984705, 38.198103 ], [ 82.307506, 43.190137 ]]),
      customPath([[ 82.307506, 43.190137 ], [80.551933, 43.740242]]),
      customPath([[80.551933, 43.740242],coords.almaty]),
      generateSmartCurve(coords.almaty, [73.438253, 43.944019], 0.2,),
      generateSmartSCurve([73.438253, 43.944019], [74.502678, 47.664885], 0.1, false)
    ),
    combinePaths(
      customPath([[61.337881,50.55604], [61.471752, 46.841979]]),
      customPath([[61.471752, 46.841979],[68.150859,42.544614]]),
      generateSmartCurve([68.150859,42.544614], [69.335194, 41.389875 ], 0.2, false)
    ),
    //astana to petropavlovsk
    customPath([[71.484191, 51.181217], [69.259274, 54.889553]])
  ]),
  
 
  import: buildRouteGeoJSON([
    //Aktau to Qulsan
    combinePaths(
    customPath([[51.1000, 44.1354], [51.1110, 44.1354]]), 
    generateParabolaMinus([51.4150, 44.1354], [54.1000, 45.054]),
    generateSmartCurve([53.9000, 45.054], [54.1000, 46.900]),
    customPath([[54.1000, 46.900], coords.shalqar])
    ),
    
    generateParabollaPlus([54.1000, 46.900], [51.88333, 47.11667]),
//GOVNO

    // Aktobe branching down to Shalqar
    combinePaths(
      generateSmartCurve([57.166666, 50.2833322],  [57.600, 49.800]),
      customPath([[57.600, 49.800], coords.shalqar]),
      generateSmartSCurve(coords.shalqar, [61.66667, 46.8 ], 0.05),
      generateSmartSCurve([61.66667, 46.8], [62.0999996, 45.7666636], 0.025, true),
      customPath([[62.0999996, 45.7666636], [70.455331512, 43.175332632 ]]),
      generateParabollaPlus([70.455331512, 43.175332632 ], coords.tashkent),
    ),
    combinePaths(
       generateCurve([70.455331512, 43.175332632 ],[71.956, 43.459184]),
      customPath([[71.956, 43.459184], coords.almaty]),
      //almaty to yining
      customPath([coords.almaty, [81.3499986, 43.8999964,]]),
      //almaty make a curve
      generateParabolaMinus(coords.almaty, [74.189142, 44.703127]),
      //curve to besides of balkash
      customPath([[74.189142, 44.703127],[72.49975,45.998683 ]]),
      //connection between balkash 
      generateParabolaMinus([72.49975,45.998683 ],[74.171556,47.421562656133774]),
      //curve nearby from balkash
      generateParabolaMinus([74.171556,47.421562656133774],[76.224284,46.968874]),
      customPath([[76.224284,46.968874],[79.454451, 46.945311]]),
      //point to alashankout
      customPath([[79.454451, 46.945311], [82.526505, 45.262149 ]]),
     
    ),
    //balkash summit to karaganda
    combinePaths(
      customPath([[74.171556,47.421562656133774], coords.karagandy]),
      //curve from karagandy and temiratau
      generateSmartCurve(coords.karagandy,[73.061898,50.075335], 0.30, false),
      combinePaths([[73.061898,50.075335], coords.astana]),
      generateSmartSCurve(coords.astana, [69.383856, 53.284056], 0.1, true),
      customPath([[69.383856, 53.284056], coords.petropavlovsk]),
    ),
    combinePaths(
      //left side Astana 
      customPath([coords.astana,[66.414336, 51.966388]]),
      generateSmartCurve([66.414336, 51.966388], coords.kostanay, 0.1)
    )
    

   
  ]),
  tmtm: buildRouteGeoJSON([
    combinePaths(
      generateSmartCurve([4.4764595, 50.5010789], [7.815336, 51.779468], 0.1, false),
      customPath([[7.815336, 51.779468],[10.533067,51.652697]]),
      customPath([[10.533067,51.652697],[10.533067,50.616982,]]),
      generateSmartCurve([10.533067,50.616982,], [10.833067,50.216982,], 0.5, false),
      customPath([[10.833067,50.216982,], coords.praga]),
      generateSmartCurve(coords.praga, [16.550124, 48.09226856997796], 0.1),
      //austria to romania
      customPath([[16.550124, 48.09226856997796],[24.820837, 46.057747 ]]),
      //romania + black sea,
      customPath([[24.820837, 46.057747 ],[31.496195, 44.763043 ]]),
      //tuclea + besides of sevastopol
      customPath([[31.496195, 44.763043 ],[32.996427,44.448301 ]]),
      //black sea[sevastopol] to tbilisi
      customPath([[32.996427,44.448301 ],[44.980505, 41.732657 ]]),
      //tb + baku
      customPath([[44.980505, 41.732657 ],[50.222525, 40.421023]]),
      generateSmartSCurve([50.222525, 40.421023],[50.812131, 44.456484], 0.2, true),
      customPath([[50.812131, 44.456484],[51.235946, 44.293985]]),
      customPath([[51.235946, 44.293985],[54.742691,45.792235]]),
      generateSmartCurve([54.742691,45.792235],[56.156604, 49.607787 ], 0.1, false),
      customPath([[56.156604, 49.607787 ],[60.686147, 50.056079]]),
      generateSmartCurve([60.686147, 50.056079],[63.404292, 50.840376], 0.1, false),
      customPath([[63.404292, 50.840376],[70.416121,51.066876 ]]),
      customPath([[70.416121,51.066876 ],[74.07351,46.903445 ]]),
      generateSmartCurve([74.07351,46.903445 ],[75.269787, 46.927218], 0.1, false),
      generateCurve([75.269787, 46.927218],[78.982943, 47.31425]),
      customPath([[78.982943, 47.31425],[82.477222, 45.512444 ]]),
      generateSmartCurve([82.477222, 45.512444 ],[95.364742, 38.871989], 0.1, false),
      generateSmartCurve([95.364742, 38.871989],[121.973106, 37.173429], 0.1, false)
    ),
    //From Republic to bottom
    customPath(
      generateSmartCurve([95.364742, 38.871989],[97.606459,34.98185 ]),
    ),
    combinePaths(
      customPath([[82.477222, 45.512444], [ 76.449857,44.816808 ]]),
      generateSmartCurve([ 76.449857,44.816808 ],[68.73163, 41.303997], 0.1, false),
      //between uz and kyrgyzstan to almost besides of the sea 
      generateSmartCurve([68.73163, 41.303997 ],[54.742691,45.792235], 0.1, false),
    ),
    combinePaths(
      //tbilisi to turkey
      generateSmartCurve([44.980505, 41.732657 ],[ 34.463236, 36.969777 ], 0.1, false),
      generateSmartCurve([ 34.463236, 36.969777 ],[ 29.14055, 41.176829 ], 0.1, false),
      customPath([[ 29.14055, 41.176829 ],[25.659159,39.526512 ]]),
      generateSmartCurve([25.659159,39.526512 ],[21.873092,36.460675 ]),
      generateSmartCurve([21.873092,36.460675 ],[15.323233,38.422495 ]),
      generateSmartSCurve([15.323233,38.422495] ,[12.476486,41.863214], 0.1, true)
    ),
    combinePaths(
      generateSmartCurve([32.996427,44.448301], [ 29.14055, 41.176829 ], 0.2, false)
    ),
    //black sea some part + bulgaria
    generateSmartCurve([27.452585, 42.609951 ],[31.496195,44.763043 ])
  ])
};

export default function Map({ language }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  const [activeTab, setActiveTab] = useState('export');

  const t = mapTranslations[language] || mapTranslations.RU;

  maptilersdk.config.apiKey = 'LUiv1kgiHTN332fEPadc';

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: "base-v4", 
      center: [68.0000, 48.0000], // Centered perfectly on Kazakhstan for the Import tab
      zoom: 4,
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
          'line-color': '#1e3a8a', // Darker blue to match your image style
          'line-width': 3,         // Slightly thicker lines
          'line-opacity': 0.9,
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
        layout: {
          'visibility': 'none' // this line to hide the dots completely
        },
        paint: {
          'circle-radius': [
            'match', ['get', 'type'],
            'hub', 6,  
            'node', 4, 
            4
          ],
          'circle-color': '#ffffff', // White dots inside
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#1e3a8a' // Dark blue border for the dots
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