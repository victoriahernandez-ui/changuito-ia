'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  popularQueries?: string[];
  onPickSuggestion?: (value: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, popularQueries = [], onPickSuggestion }: SearchBarProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative group">
          <Search className="absolute left-5 top-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Leche, pan, queso..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-20 py-4 text-base border-2 border-white/40 rounded-xl focus:outline-none focus:border-blue-400/60 focus:ring-4 focus:ring-blue-200/40 transition duration-300 group-hover:border-white/60 bg-white/30 backdrop-blur-md placeholder-slate-500"
          />
          <button className="absolute right-1.5 top-1.5 bg-slate-900/90 hover:bg-slate-800/90 text-white px-6 py-2.5 rounded-lg font-medium transition duration-300 backdrop-blur-md border border-slate-700/50">
            Buscar
          </button>
        </div>
      </div>

      {/* Popular searches */}
      <div className="flex flex-wrap justify-center gap-3">
        {(popularQueries.length > 0 ? popularQueries : ['Leche', 'Pan', 'Huevos', 'Queso', 'Yogur', 'Aceite']).map(item => (
          <button
            key={item}
            onClick={() => (onPickSuggestion ? onPickSuggestion(item) : setSearchQuery(item))}
            className="px-5 py-2.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-full transition duration-300 font-medium text-sm border border-slate-200 hover:border-blue-300"
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );
}