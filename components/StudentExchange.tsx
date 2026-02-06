
import React, { useState, useRef } from 'react';
import { 
  ShoppingBag, 
  Search as SearchIcon, 
  Plus, 
  Camera, 
  Truck, 
  ChevronRight,
  Filter,
  Heart,
  Zap,
  Leaf,
  PhoneCall,
  Scale,
  Music,
  Share2,
  AlertCircle,
  Star,
  X,
  Trash2,
  Navigation,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle2,
  MapPin,
  Clock,
  TrendingDown,
  Info,
  Code
} from 'lucide-react';

interface MarketplaceItem {
  id: number;
  title: string;
  price: number;
  seller: string;
  image: string;
  category: string;
  description: string;
}

interface LostFoundItem {
  id: number;
  type: 'lost' | 'found';
  title: string;
  location: string;
  date: string;
  image: string;
  category: string;
  description: string;
  reporter: string;
}

const StudentExchange: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('marketplace');
  const [wishlist, setWishlist] = useState<number[]>([]);
  
  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLFModalOpen, setIsLFModalOpen] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [lfType, setLfType] = useState<'lost' | 'found'>('lost');
  const [imageType, setImageType] = useState<'url' | 'file'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Main Data States
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([
    { id: 1, title: 'Calculus Made Easy', price: 1800, seller: 'Alice R.', image: 'https://picsum.photos/400/300?random=1', category: 'Books', description: 'Great for midterm prep.' },
    { id: 2, title: 'Mechanical Keyboard RGB', price: 2450, seller: 'Bob M.', image: 'https://picsum.photos/400/300?random=2', category: 'Electronics', description: 'Blue switches, very clicky.' },
    { id: 3, title: 'Hero Bicycle - 18 Speed', price: 6500, seller: 'Charlie K.', image: 'https://picsum.photos/400/300?random=3', category: 'Transport', description: 'Recently serviced.' },
  ]);

  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([
    { id: 1, type: 'lost', title: 'Blue Nike Backpack', location: 'Central Library', date: 'Oct 22', category: 'Personal', description: 'Contains a laptop and several notebooks.', image: 'https://picsum.photos/400/300?random=10', reporter: 'Sam V.' },
    { id: 2, type: 'found', title: 'Keys with Keychain', location: 'Canteen Area', date: 'Oct 23', category: 'Keys', description: 'Has a small rubber duck keychain.', image: 'https://picsum.photos/400/300?random=11', reporter: 'Security Post 1' },
  ]);

  const travelRides = [
    { id: 1, from: 'Campus Main Gate', to: 'Airport (IGI)', time: '4:00 PM', date: 'Oct 24', passengers: 2, max: 4, pricePerPerson: 850, carbonSaved: '2.4kg', driverRating: 4.9 },
    { id: 2, from: 'Hostel Block B', to: 'Railway Station', time: '11:00 AM', date: 'Oct 25', passengers: 1, max: 3, pricePerPerson: 350, carbonSaved: '0.8kg', driverRating: 4.7 },
  ];

  const skillExchange = [
    { provider: 'Sarah T.', skill: 'Python/ML', offering: 'Code Review', seeking: 'Guitar Lessons', rating: 4.9 },
    { provider: 'James L.', skill: 'Mathematics', offering: 'Calculus Tutoring', seeking: 'Coffee/Barter', rating: 4.8 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMarketItem = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = imageType === 'file' ? (imageFile || 'https://picsum.photos/400/300?grayscale') : (imageUrl || 'https://picsum.photos/400/300?grayscale');

    const newItem: MarketplaceItem = {
      id: Date.now(),
      title: newTitle,
      price: Number(newPrice),
      seller: 'John Doe (You)',
      image: finalImage,
      category: newCategory,
      description: newDesc,
    };
    setMarketplaceItems([newItem, ...marketplaceItems]);
    setIsPostModalOpen(false);
    resetForm();
  };

  const handleAddLFItem = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = imageType === 'file' ? (imageFile || 'https://picsum.photos/400/300?grayscale') : (imageUrl || 'https://picsum.photos/400/300?grayscale');

    const newItem: LostFoundItem = {
      id: Date.now(),
      type: lfType,
      title: newTitle,
      location: newLocation,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      category: newCategory,
      description: newDesc,
      image: finalImage,
      reporter: 'John Doe (You)',
    };
    setLostFoundItems([newItem, ...lostFoundItems]);
    setIsLFModalOpen(false);
    resetForm();
  };

  const deleteMarketItem = (id: number) => {
    setMarketplaceItems(prev => prev.filter(item => item.id !== id));
  };

  const deleteLFItem = (id: number) => {
    setLostFoundItems(prev => prev.filter(item => item.id !== id));
  };

  const resetForm = () => {
    setNewTitle('');
    setNewPrice('');
    setNewCategory('Electronics');
    setNewDesc('');
    setNewLocation('');
    setImageUrl('');
    setImageFile(null);
    setImageType('url');
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 font-sans">
      {/* Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex p-1.5 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
          {[
            { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag size={16} /> },
            { id: 'travel', label: 'Travel Pool', icon: <Truck size={16} /> },
            { id: 'lostfound', label: 'Lost & Found', icon: <SearchIcon size={16} /> },
            { id: 'skills', label: 'Nexus Skills', icon: <Zap size={16} /> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-black transition-all whitespace-nowrap ${
                activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              if (activeSubTab === 'lostfound') setIsLFModalOpen(true);
              else setIsPostModalOpen(true);
            }}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-black transition-all flex items-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={20} />
            <span>{activeSubTab === 'lostfound' ? 'Report Item' : 'Post Listing'}</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'marketplace' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketplaceItems.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 hover:shadow-xl transition-all flex flex-col relative group">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleWishlist(item.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      wishlist.includes(item.id) ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={16} fill={wishlist.includes(item.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-black text-slate-800 text-lg truncate pr-4">{item.title}</h4>
                    <button 
                      onClick={() => deleteMarketItem(item.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-2xl font-black text-indigo-600 mb-4">₹{item.price.toLocaleString()}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-xs font-black text-indigo-600">
                      {item.seller[0]}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{item.seller}</p>
                    <button className="bg-slate-50 p-2 rounded-lg text-slate-400 hover:bg-indigo-600 hover:text-white transition-all ml-auto">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'travel' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Travel Stats Sidebar */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                  <h4 className="font-black text-slate-800 mb-6 flex items-center">
                    <Navigation size={22} className="text-indigo-600 mr-3" />
                    Pool Insights
                  </h4>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                              <Leaf size={20} />
                           </div>
                           <p className="text-sm font-bold text-slate-600">Total Carbon Saved</p>
                        </div>
                        <span className="text-lg font-black text-emerald-600">124kg</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                              <TrendingDown size={20} />
                           </div>
                           <p className="text-sm font-bold text-slate-600">Est. Savings/Mo</p>
                        </div>
                        <span className="text-lg font-black text-indigo-600">₹4,500</span>
                     </div>
                  </div>
                  <button className="w-full mt-8 bg-indigo-50 text-indigo-600 font-black py-4 rounded-[2rem] hover:bg-indigo-100 transition-all text-sm">
                    View My Recurring Trips
                  </button>
               </div>

               <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-xl">
                  <div className="flex items-center space-x-3 mb-4">
                     <AlertCircle size={20} className="text-amber-400" />
                     <h4 className="font-bold">Safety Hub</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">Nexus Travel Pool includes 24/7 location sharing and Emergency Contact sync.</p>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center space-x-2 border border-white/10">
                    <PhoneCall size={16} />
                    <span>Emergency SOS</span>
                  </button>
               </div>
            </div>

            {/* Travel Listings */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-800">Active Ride Requests</h3>
              </div>

              {travelRides.map((ride) => (
                <div key={ride.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group relative overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{ride.date} · {ride.time}</p>
                          <h4 className="text-xl font-black text-slate-800 flex items-center">
                            {ride.from} <ChevronRight size={20} className="mx-2 text-slate-300" /> {ride.to}
                          </h4>
                        </div>
                        <div className="flex flex-col items-end">
                           <div className="flex items-center text-amber-500 font-black text-sm mb-1">
                              <Star size={14} fill="currentColor" className="mr-1" /> {ride.driverRating}
                           </div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Driver Rating</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-50">
                        <div className="flex items-center space-x-3">
                           <div className="flex -space-x-3">
                              {[...Array(ride.passengers)].map((_, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 shadow-sm overflow-hidden">
                                   <img src={`https://i.pravatar.cc/150?u=${ride.id + i}`} alt="User" />
                                </div>
                              ))}
                              {[...Array(ride.max - ride.passengers)].map((_, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center shadow-sm">
                                  <Plus size={14} className="text-indigo-300" />
                                </div>
                              ))}
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-800">{ride.max - ride.passengers} Seats Open</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Capacity: {ride.max}</p>
                           </div>
                        </div>

                        <div className="flex items-center space-x-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                           <Leaf size={16} className="text-emerald-600" />
                           <span className="text-[10px] font-black text-emerald-700 uppercase">Eco Impact: {ride.carbonSaved} Saved</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between md:items-end md:w-48 pt-6 md:pt-0 md:pl-8 md:border-l border-slate-50 shrink-0">
                      <div className="md:text-right">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Split Cost</p>
                        <p className="text-3xl font-black text-slate-800">₹{ride.pricePerPerson}<span className="text-xs text-slate-400 ml-1">/per head</span></p>
                      </div>
                      <button className="mt-6 w-full md:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
                        Request Seat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'lostfound' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lostFoundItems.map((item) => (
              <div key={item.id} className={`bg-white rounded-[2.5rem] overflow-hidden border transition-all shadow-sm hover:shadow-lg relative ${item.type === 'lost' ? 'border-rose-100' : 'border-emerald-100'}`}>
                <div className="relative h-44">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${item.type === 'lost' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      {item.type}
                    </span>
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteLFItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-xl text-slate-300 hover:text-rose-500 transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-6">
                  <h4 className="font-black text-slate-800 text-lg mb-4">{item.title}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-xs font-bold text-slate-500">
                      <MapPin size={14} className="mr-2 text-indigo-500" />
                      {item.location}
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-500">
                      <Clock size={14} className="mr-2 text-indigo-500" />
                      {item.date}
                    </div>
                    <p className="text-xs text-slate-500 italic line-clamp-2">"{item.description}"</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                       <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                         {item.reporter[0]}
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">{item.reporter}</p>
                    </div>
                    <button className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${item.type === 'lost' ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}>
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'skills' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-black text-slate-800">Skill Barter & Peer Tutoring</h3>
                 <p className="text-sm text-slate-500 font-medium">Knowledge is our campus currency.</p>
              </div>
              <button className="flex items-center space-x-2 text-indigo-600 font-black text-sm hover:underline">
                 <span>Group Discounts & Co-buys</span>
                 <ChevronRight size={18} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillExchange.map((item, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-600 text-xl font-black border-2 border-white shadow-sm">
                           {item.provider[0]}
                        </div>
                        <div>
                           <p className="text-lg font-black text-slate-800">{item.provider}</p>
                           <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{item.skill}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center text-amber-500 font-black mb-1">
                            <Star size={16} fill="currentColor" className="mr-1" /> {item.rating}
                         </div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Instructor Grade</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100">
                         <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center">
                            <Code size={12} className="mr-1.5" /> Offering
                         </p>
                         <p className="text-sm font-black text-indigo-800">{item.offering}</p>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                         <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center">
                            <Music size={12} className="mr-1.5" /> Seeking
                         </p>
                         <p className="text-sm font-black text-emerald-800">{item.seeking}</p>
                      </div>
                   </div>

                   <button className="w-full bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 font-black py-4 rounded-[1.5rem] transition-all flex items-center justify-center space-x-2">
                      <Share2 size={18} />
                      <span>Propose Barter Exchange</span>
                   </button>
                </div>
              ))}
           </div>

           <div className="bg-indigo-600 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center shrink-0">
                 <Scale size={40} />
              </div>
              <div className="flex-1">
                 <h4 className="text-2xl font-black mb-2">Subscription Share Co-op</h4>
                 <p className="text-indigo-100 font-medium">Split the cost of Netflix, Spotify, or Coursera with verified campus residents. Managed legally and securely via Nexus Wallets.</p>
              </div>
              <button className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-sm shadow-2xl hover:scale-110 transition-transform whitespace-nowrap">
                Join Share Hub
              </button>
           </div>
        </div>
      )}

      {/* Posting Modals */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsPostModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <h3 className="font-black text-slate-800 text-xl">New Marketplace Listing</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddMarketItem} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What are you selling?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    type="number" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold appearance-none"
                  >
                    <option>Electronics</option>
                    <option>Books</option>
                    <option>Transport</option>
                    <option>Furniture</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button type="button" onClick={() => setImageType('url')} className={`p-1.5 rounded-lg ${imageType === 'url' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><LinkIcon size={14} /></button>
                    <button type="button" onClick={() => setImageType('file')} className={`p-1.5 rounded-lg ${imageType === 'file' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><ImageIcon size={14} /></button>
                  </div>
                </div>
                {imageType === 'url' ? (
                  <input 
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold"
                  />
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 overflow-hidden">
                    {imageFile ? <img src={imageFile} alt="Preview" className="w-full h-full object-cover" /> : <><Camera size={24} className="text-slate-300 mb-1" /><span className="text-[10px] font-black text-slate-400 uppercase">Click to upload</span></>}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details about the item..."
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold resize-none"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-[2rem] shadow-xl transition-all active:scale-95">
                List Item
              </button>
            </form>
          </div>
        </div>
      )}

      {isLFModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsLFModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <h3 className="font-black text-slate-800 text-xl">Report Lost/Found</h3>
              <button onClick={() => setIsLFModalOpen(false)} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddLFItem} className="p-8 space-y-6">
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                 <button type="button" onClick={() => setLfType('lost')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${lfType === 'lost' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500'}`}>Lost</button>
                 <button type="button" onClick={() => setLfType('found')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${lfType === 'found' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>Found</button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What happened?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                  <input 
                    type="text" 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Block A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold appearance-none"
                  >
                    <option>Personal</option>
                    <option>Keys</option>
                    <option>Electronics</option>
                    <option>Academic</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button type="button" onClick={() => setImageType('url')} className={`p-1.5 rounded-lg ${imageType === 'url' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><LinkIcon size={14} /></button>
                    <button type="button" onClick={() => setImageType('file')} className={`p-1.5 rounded-lg ${imageType === 'file' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><ImageIcon size={14} /></button>
                  </div>
                </div>
                {imageType === 'url' ? (
                  <input 
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold"
                  />
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 overflow-hidden">
                    {imageFile ? <img src={imageFile} alt="Preview" className="w-full h-full object-cover" /> : <><Camera size={24} className="text-slate-300 mb-1" /><span className="text-[10px] font-black text-slate-400 uppercase">Click to upload</span></>}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details about the item..."
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-semibold resize-none"
                  required
                />
              </div>

              <button type="submit" className={`w-full text-white font-black py-4 rounded-[2rem] shadow-xl transition-all active:scale-95 ${lfType === 'lost' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                Confirm Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExchange;
