
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  Map as MapIcon, 
  Star, 
  Coffee, 
  Trees, 
  Building,
  Navigation,
  Info,
  ChevronRight,
  Zap,
  MapPin,
  Search,
  Users,
  Clock,
  Car,
  Bus,
  Train,
  Wind,
  Droplets,
  Calendar,
  AlertCircle,
  Accessibility,
  Percent,
  Timer,
  Dumbbell,
  Library,
  Utensils,
  CreditCard,
  Wrench,
  Home
} from 'lucide-react';

const ExplorersGuide: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Layer }>({});
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Updated with exact coordinates to enable navigation
  const attractions = [
    { 
      name: 'Nalanda Library', 
      type: 'Academic', 
      vibes: ['#DeepStudy', '#QuietZone'], 
      rating: 4.9, 
      distance: '0.1 km', 
      coords: [30.9688, 76.4725] as [number, number],
      icon: <Library className="w-12 h-12" />,
      color: 'from-blue-600 to-indigo-700',
      crowd: 88,
      openUntil: '24/7',
      discount: null,
      accessible: true
    },
    { 
      name: 'Cafeteria - IIT Ropar', 
      type: 'Eateries', 
      vibes: ['#PocketFriendly', '#LunchSpot'], 
      rating: 4.5, 
      distance: '0.3 km', 
      coords: [30.9678, 76.4722] as [number, number],
      icon: <Utensils className="w-12 h-12" />,
      color: 'from-orange-500 to-red-600',
      crowd: 72,
      openUntil: '21:30',
      discount: 'Free Refill with ID',
      accessible: true
    },
    { 
      name: 'Cafe Backyard', 
      type: 'Eateries', 
      vibes: ['#Outdoor', '#Hangout'], 
      rating: 4.7, 
      distance: '0.6 km', 
      coords: [30.9710, 76.4728] as [number, number],
      icon: <Coffee className="w-12 h-12" />,
      color: 'from-emerald-500 to-teal-600',
      crowd: 35,
      openUntil: '23:00',
      discount: '10% Night Discount',
      accessible: true
    },
    { 
      name: 'Gym (Men)', 
      type: 'Activity', 
      vibes: ['#Fitness', '#HostelSide'], 
      rating: 4.6, 
      distance: '0.4 km', 
      coords: [30.9694, 76.4705] as [number, number],
      icon: <Dumbbell className="w-12 h-12" />,
      color: 'from-indigo-600 to-violet-700',
      crowd: 25,
      openUntil: '22:00',
      discount: null,
      accessible: true
    },
    { 
      name: 'S. Ramanujan Block', 
      type: 'Academic', 
      vibes: ['#MainLabs', '#LHC'], 
      rating: 4.8, 
      distance: '0.2 km', 
      coords: [30.9692, 76.4735] as [number, number],
      icon: <Building className="w-12 h-12" />,
      color: 'from-slate-700 to-slate-900',
      crowd: 60,
      openUntil: '18:00',
      discount: null,
      accessible: true
    },
    { 
      name: 'Utility Block', 
      type: 'Emergency', 
      vibes: ['#Maintenance', '#24x7'], 
      rating: 4.4, 
      distance: '0.5 km', 
      coords: [30.9685, 76.4718] as [number, number],
      icon: <Wrench className="w-12 h-12" />,
      color: 'from-amber-500 to-orange-600',
      crowd: 15,
      openUntil: '24/7',
      discount: null,
      accessible: true
    }
  ];

  // Map points based on the screenshot orientation
  const campusPoints = [
    { name: 'Nalanda Library', coords: [30.9688, 76.4725] as [number, number], type: 'Academic' },
    { name: 'Cafeteria - IIT Ropar', coords: [30.9678, 76.4722] as [number, number], type: 'Eateries' },
    { name: 'S. Ramanujan Block', coords: [30.9692, 76.4735] as [number, number], type: 'Academic' },
    { name: 'Utility Block', coords: [30.9685, 76.4718] as [number, number], type: 'Emergency' },
    { name: 'Gym (Men)', coords: [30.9694, 76.4705] as [number, number], type: 'Activity' },
    { name: 'Cafe Backyard', coords: [30.9710, 76.4728] as [number, number], type: 'Eateries' },
    { name: 'Bus Bay', coords: [30.9693, 76.4715] as [number, number], type: 'Transport' },
    { name: 'HDFC Bank', coords: [30.9702, 76.4720] as [number, number], type: 'Utility' }
  ];

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on IIT Ropar Main Campus
    const iitRoparCoords: [number, number] = [30.96917, 76.47226];
    
    mapRef.current = L.map(mapContainerRef.current, {
      center: iitRoparCoords,
      zoom: 17,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
    }).addTo(mapRef.current);

    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        setIsMapLoaded(true);
      }
    }, 250);

    campusPoints.forEach(point => {
      const marker = L.circleMarker(point.coords, {
        radius: 10,
        fillColor: point.type === 'Emergency' ? '#ef4444' : point.type === 'Academic' ? '#4f46e5' : '#10b981',
        color: "#fff",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(mapRef.current!)
        .bindPopup(`<div class="p-2 font-sans"><b class="text-indigo-600">${point.name}</b><br/><span class="text-xs text-slate-500 font-bold uppercase tracking-widest">${point.type} Center</span></div>`);
      
      markersRef.current[point.name] = marker;
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        if (mapRef.current) {
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: `<div class="w-6 h-6 bg-indigo-600 border-4 border-white rounded-full shadow-2xl ring-4 ring-indigo-500/20 animate-pulse"></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
          }).addTo(mapRef.current).bindPopup("<div class='font-bold text-indigo-600 px-2'>You are here</div>");
        }
      });
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  const handleNavigate = (name: string, coords: [number, number]) => {
    if (!mapRef.current) return;
    
    // Smooth fly to the location
    mapRef.current.flyTo(coords, 18, {
      duration: 1.5,
      easeLinearity: 0.25
    });

    // Programmatically open the popup
    const marker = markersRef.current[name];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 1500); // Wait for pan animation to complete
    }

    // Scroll map into view on mobile
    if (window.innerWidth < 768) {
      mapContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const autoFareRoutes = [
    { route: 'Campus to Ropar Station', dist: '7.5km', fare: '₹120 - ₹150' },
    { route: 'Campus to Bela Chowk', dist: '6.2km', fare: '₹100 - ₹120' },
    { route: 'Campus to Transit Campus', dist: '5.8km', fare: '₹80 - ₹100' },
  ];

  const filteredAttractions = attractions.filter(a => 
    (activeCategory === 'All' || a.type === activeCategory) &&
    (a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 font-sans animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center">
            <Compass className="text-indigo-600 mr-4 w-10 h-10" />
            Explorer’s Guide
          </h2>
          <p className="text-slate-500 font-bold ml-1">IIT Ropar Interactive Ecosystem Navigator</p>
        </div>
        <div className="flex-1 max-w-xl relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
          <input 
            type="text" 
            placeholder="Search Buildings (Nalanda, Ramanujan) or Spots..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 shadow-xl shadow-slate-200/50 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          
          {/* Map Component */}
          <div className="relative h-[550px] bg-slate-200 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white group">
            <div ref={mapContainerRef} className="absolute inset-0" />
            
            {!isMapLoaded && (
              <div className="absolute inset-0 z-[2000] bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                 <RefreshCw className="w-10 h-10 animate-spin mb-4" />
                 <p className="font-black uppercase tracking-widest text-xs">Syncing with IIT Ropar Grid...</p>
              </div>
            )}

            <div className="absolute top-8 left-8 z-[1000] flex flex-col gap-3">
              <button 
                onClick={() => mapRef.current?.flyTo([30.96917, 76.47226], 18)}
                className="bg-white/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center space-x-3 font-black text-sm"
              >
                <Navigation size={20} fill="currentColor" />
                <span>Recenter Campus</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-2">
            {['All', 'Academic', 'Eateries', 'Activity', 'Emergency'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                  activeCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 translate-y-[-2px]' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredAttractions.map((spot, idx) => {
              return (
                <div key={idx} className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all group flex flex-col relative animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  {spot.discount && (
                    <div className="absolute top-6 left-6 z-20 bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center shadow-xl">
                      <Percent size={14} className="mr-1.5" /> {spot.discount}
                    </div>
                  )}
                  
                  {/* Styled Display Card Header */}
                  <div className={`h-48 bg-gradient-to-br ${spot.color} flex items-center justify-center text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4">
                       {[...Array(20)].map((_, i) => <Zap key={i} size={40} />)}
                    </div>
                    <div className="relative transform group-hover:scale-125 transition-transform duration-700">
                      {spot.icon}
                    </div>
                    <div className="absolute bottom-6 left-6 text-white text-left">
                       <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">
                          <MapPin size={12} />
                          <span>{spot.distance} from Core Hostels</span>
                       </div>
                       <h4 className="text-2xl font-black">{spot.name}</h4>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center text-amber-500 font-black text-sm">
                          <Star size={18} fill="currentColor" className="mr-1.5" />
                          {spot.rating} <span className="text-slate-400 font-bold ml-2">consensus</span>
                       </div>
                       <div className={`text-[10px] font-black uppercase tracking-widest flex items-center text-slate-500`}>
                          <Timer size={14} className="mr-1.5" /> Until {spot.openUntil}
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                       {spot.vibes.map(v => (
                         <span key={v} className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100">
                           {v}
                         </span>
                       ))}
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Live Occupancy</span>
                            <span className="text-[11px] font-black text-slate-800">{spot.crowd}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full transition-all duration-1000 ${spot.crowd > 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${spot.crowd}%` }}></div>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleNavigate(spot.name, spot.coords)}
                         className="ml-6 bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg hover:scale-105 active:scale-95"
                       >
                         Navigate
                       </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm">
             <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center">
               <Building className="mr-3 text-indigo-600" />
               Building Index
             </h4>
             <div className="space-y-4">
                {campusPoints.filter(p => p.type !== 'Transport').map((b, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleNavigate(b.name, b.coords)}
                    className="p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all cursor-pointer group"
                  >
                     <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{b.name}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{b.type} Center</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
             <h4 className="text-xl font-black mb-6 flex items-center">
               <Bus className="mr-4 text-emerald-400" />
               Ropar Transit Hub
             </h4>
             
             <div className="space-y-6">
                <div 
                  onClick={() => {
                    const busPoint = campusPoints.find(p => p.name === 'Bus Bay');
                    if(busPoint) handleNavigate(busPoint.name, busPoint.coords);
                  }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all"
                >
                   <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                         <Bus size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-black">Gate 1 Shuttle</p>
                         <p className="text-[10px] text-emerald-400 font-black animate-pulse uppercase tracking-tighter">Live: 0.2km away</p>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                   <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400">
                         <Train size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-black">Ropar Station Link</p>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Next: 15:45</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-8 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Auto Fare (Approximate)</p>
                <div className="space-y-4">
                  {autoFareRoutes.map((r, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                       <span className="text-slate-400 font-medium">{r.route}</span>
                       <span className="font-black text-white">{r.fare}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export default ExplorersGuide;
