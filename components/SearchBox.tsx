import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Droplets, X, Star, ChevronRight } from 'lucide-react';
import { Lake, WaterQuality } from '../types';
import { LAKES, QUALITY_COLORS } from '../constants.tsx';

interface SearchBoxProps {
  onSelect: (lake: Lake) => void;
  onFilter: (quality: WaterQuality | null) => void;
  activeFilter: WaterQuality | null;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSelect, onFilter, activeFilter }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredLakes = LAKES.filter(lake => 
    lake.name.toLowerCase().includes(query.toLowerCase()) || 
    lake.location.toLowerCase().includes(query.toLowerCase())
  );

  const displayLakes = query.trim() === '' ? LAKES.slice(0, 5) : filteredLakes;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lake: Lake) => {
    onSelect(lake);
    setQuery(lake.name);
    setIsOpen(false);
  };

  return (
    <div className="w-full md:w-[420px] flex flex-col gap-4" ref={containerRef}>
      {/* Search Input Container */}
      <div className="relative group">
        <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-center bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white overflow-hidden transition-all focus-within:ring-4 focus-within:ring-blue-600/10 focus-within:border-blue-200">
          <Search className="ml-6 text-slate-400" size={20} strokeWidth={2.5} />
          <input
            type="text"
            className="w-full py-5 px-4 outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium text-lg"
            placeholder="Search lakes or regions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); setIsOpen(false); }}
              className="p-3 mr-3 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"
            >
              <X size={18} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white overflow-hidden max-h-[500px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              {query ? 'Global Registry' : 'Featured Environments'}
            </h4>
            {!query && <Star size={12} className="text-blue-500 fill-blue-500" />}
          </div>
          
          {displayLakes.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {displayLakes.map((lake) => (
                <button
                  key={lake.id}
                  onClick={() => handleSelect(lake)}
                  className="w-full flex items-center gap-5 p-5 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: QUALITY_COLORS[lake.type] }}
                  >
                    <Droplets size={22} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-base group-hover:text-blue-600 transition-colors leading-tight">{lake.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-bold">
                      <MapPin size={12} /> {lake.location.toUpperCase()}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Search size={32} className="text-slate-300" />
              </div>
              <p className="text-lg font-black text-slate-800 mb-2">Registry Mismatch</p>
              <p className="text-sm font-medium text-slate-400 mb-6">No data found for "{query}"</p>
              <button 
                onClick={() => setQuery('')}
                className="px-6 py-2 bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest rounded-full hover:bg-blue-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* High-End Quality Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {(['fresh', 'normal', 'hazardous'] as WaterQuality[]).map(type => (
          <button
            key={type}
            onClick={() => onFilter(activeFilter === type ? null : type)}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all flex items-center gap-3 ${
              activeFilter === type 
              ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
              : 'bg-white/80 backdrop-blur-md text-slate-500 border-white hover:border-blue-200 hover:text-blue-600 shadow-md'
            }`}
          >
            <span className="w-2 h-2 rounded-full ring-4 ring-offset-2 ring-transparent" style={{ 
              backgroundColor: QUALITY_COLORS[type],
              boxShadow: activeFilter === type ? `0 0 12px ${QUALITY_COLORS[type]}` : 'none'
            }}></span>
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;