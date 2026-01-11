import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import Splash from './components/Splash';
import SearchBox from './components/SearchBox';
import Chat from './components/Chat';
import { Lake, WaterQuality, LocationState } from './types';
import { LAKES, INITIAL_CENTER, INITIAL_ZOOM, QUALITY_COLORS } from './constants.tsx';
import { Navigation, Compass, BarChart3, Info, Activity, Wind, Droplet, ExternalLink, X, ChevronRight } from 'lucide-react';

// Component to handle map view movements
const MapController: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
};

// Custom user icon - refined for professional look
const userIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 bg-blue-500/10 rounded-full animate-ping"></div>
      <div class="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

const App: React.FC = () => {
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [activeFilter, setActiveFilter] = useState<WaterQuality | null>(null);
  const [mapState, setMapState] = useState<{ center: [number, number], zoom: number }>({
    center: INITIAL_CENTER,
    zoom: INITIAL_ZOOM
  });
  const [userLocation, setUserLocation] = useState<LocationState | null>(null);
  const [permissionPrompt, setPermissionPrompt] = useState(false);
  const [hoveredLakeId, setHoveredLakeId] = useState<string | null>(null);
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);

  const filteredLakes = activeFilter 
    ? LAKES.filter(l => l.type === activeFilter)
    : LAKES;

  const handleLakeSelect = (lake: Lake) => {
    setMapState({ center: [lake.lat, lake.lon], zoom: 13 });
    setSelectedLake(lake);
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setMapState({ center: [loc.lat, loc.lng], zoom: 10 });
        setPermissionPrompt(false);
      },
      () => setPermissionPrompt(false)
    );
  }, []);

  const findNearest = () => {
    if (!userLocation) {
      setPermissionPrompt(true);
      return;
    }

    let minDistance = Infinity;
    let nearest: Lake | null = null;

    LAKES.forEach(lake => {
      const dist = Math.sqrt(Math.pow(lake.lat - userLocation.lat, 2) + Math.pow(lake.lon - userLocation.lng, 2));
      if (dist < minDistance) {
        minDistance = dist;
        nearest = lake;
      }
    });

    if (nearest) handleLakeSelect(nearest);
  };

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' } as any).then((result: any) => {
      if (result.state === 'granted') requestLocation();
    });
  }, [requestLocation]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {isSplashActive && <Splash onComplete={() => setIsSplashActive(false)} />}

      {/* Main Map Canvas */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={INITIAL_CENTER} 
          zoom={INITIAL_ZOOM} 
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          />
          <MapController center={mapState.center} zoom={mapState.zoom} />
          
          {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />}

          {filteredLakes.map(lake => (
            <CircleMarker
              key={lake.id}
              center={[lake.lat, lake.lon]}
              radius={hoveredLakeId === lake.id || selectedLake?.id === lake.id ? 15 : 10}
              eventHandlers={{
                mouseover: () => setHoveredLakeId(lake.id),
                mouseout: () => setHoveredLakeId(null),
                click: () => handleLakeSelect(lake)
              }}
              pathOptions={{
                color: 'white',
                weight: (hoveredLakeId === lake.id || selectedLake?.id === lake.id) ? 4 : 2,
                fillColor: QUALITY_COLORS[lake.type],
                fillOpacity: (hoveredLakeId === lake.id || selectedLake?.id === lake.id) ? 1 : 0.8,
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Interface Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 pointer-events-auto">
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <SearchBox 
              onSelect={handleLakeSelect} 
              onFilter={setActiveFilter}
              activeFilter={activeFilter}
            />
          </div>

          {/* Environmental Dashboard Panel */}
          <div className="hidden lg:flex flex-col gap-3 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/40 min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Regional Intelligence</h3>
              <Activity size={16} className="text-blue-500 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Monitored</p>
                <p className="text-2xl font-black text-slate-900">{LAKES.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
                <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  Optimal
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mb-2">
                <span>Composition</span>
                <span>Fresh ({(LAKES.filter(l => l.type === 'fresh').length / LAKES.length * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-green-500" style={{ width: '60%' }}></div>
                <div className="h-full bg-amber-500" style={{ width: '25%' }}></div>
                <div className="h-full bg-red-500" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Controls */}
        <div className="flex justify-between items-end pointer-events-auto">
          <div className="flex flex-col gap-3">
            <button
              onClick={findNearest}
              className="flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-[2rem] shadow-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 group"
            >
              <Navigation size={20} className="fill-blue-400 text-blue-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              Intelligence Routing
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => userLocation ? setMapState({ center: [userLocation.lat, userLocation.lng], zoom: 12 }) : requestLocation()}
                className="w-14 h-14 bg-white text-slate-700 rounded-2xl shadow-xl flex items-center justify-center hover:bg-slate-50 border border-slate-100 transition-all active:scale-90"
              >
                <Compass size={24} />
              </button>
              <button
                className="w-14 h-14 bg-white text-slate-700 rounded-2xl shadow-xl flex items-center justify-center hover:bg-slate-50 border border-slate-100 transition-all active:scale-90"
              >
                <BarChart3 size={24} />
              </button>
            </div>
          </div>
          
          <Chat />
        </div>
      </div>

      {/* Selected Lake Intelligence Side Panel */}
      {selectedLake && (
        <div className="absolute top-0 right-0 h-full w-full md:w-[420px] bg-white/95 backdrop-blur-2xl z-[1500] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-white/40 animate-in slide-in-from-right duration-500 ease-out flex flex-col">
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            <img 
              src={`https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800`} 
              className="w-full h-full object-cover" 
              alt={selectedLake.name} 
            />
            <button 
              onClick={() => setSelectedLake(null)}
              className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-6 left-8 z-20">
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-2 text-white border border-white/40`} style={{ backgroundColor: QUALITY_COLORS[selectedLake.type] }}>
                {selectedLake.type} Water Quality
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter">{selectedLake.name}</h2>
              <p className="text-white/70 text-sm flex items-center gap-1.5 font-medium">
                <MapPinIcon size={14} /> {selectedLake.location}, India
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                  <Wind size={20} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Turbidity</p>
                <p className="text-xl font-black text-slate-800">4.2 NTU</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                  <Droplet size={20} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">pH Level</p>
                <p className="text-xl font-black text-slate-800">7.4 pH</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Conservation Status</h4>
                <Info size={14} className="text-slate-300" />
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {selectedLake.name} is currently categorized as {selectedLake.type}. It serves as a vital ecosystem for {selectedLake.location}. Regular monitoring confirms {selectedLake.type === 'fresh' ? 'excellent' : 'moderate'} biological diversity maintenance.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedLake.lat},${selectedLake.lon}`, '_blank')}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 group"
              >
                Launch Field Navigation
                <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button 
                onClick={() => setSelectedLake(null)}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Close Intelligence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {permissionPrompt && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <MapPinIcon size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Locational Context</h2>
            <p className="text-slate-500 mb-10 font-medium leading-relaxed">Required for real-time proximity analysis and localized environmental reports.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={requestLocation}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Authorize
              </button>
              <button
                onClick={() => setPermissionPrompt(false)}
                className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-100 transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapPinIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default App;