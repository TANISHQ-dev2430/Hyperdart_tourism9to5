import React, { useState } from 'react';
import { Search, Sparkles, MapPin, ArrowRight } from 'lucide-react';

const PRESET_QUERIES = [
  { label: 'NYC Attractions', query: 'Tourist attractions in NYC' },
  { label: 'Paris Things To Do', query: 'Things to do in Paris' },
  { label: 'Kyoto Places to Visit', query: 'Places to visit in Kyoto' },
  { label: 'Rome Landmarks', query: 'Landmarks in Rome' },
  { label: 'Tokyo Sights', query: 'Sights near Tokyo' },
  { label: 'London POIs', query: 'Points of interest in London' }
];

export default function QuerySearchBar({ currentQuery, onSearch }) {
  const [inputVal, setInputVal] = useState(currentQuery || 'Tourist attractions in NYC');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const handleSelectPreset = (presetQuery) => {
    setInputVal(presetQuery);
    onSearch(presetQuery);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        
        <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden p-1.5 focus-within:border-indigo-500 transition-all">
          <div className="pl-4 pr-2 text-indigo-400">
            <Search className="h-5 w-5 animate-pulse" />
          </div>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask anything: e.g. 'things to do in Paris' or 'landmarks in Rome'..."
            className="w-full bg-transparent px-2 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none font-medium"
          />

          <button
            type="submit"
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-4 flex items-center justify-start sm:justify-center flex-wrap gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 flex items-center mr-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 mr-1" /> Presets:
        </span>
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPreset(preset.query)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 border ${
              inputVal.toLowerCase() === preset.query.toLowerCase()
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-sm shadow-indigo-500/20'
                : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 border-slate-700/80 hover:text-white'
            }`}
          >
            <MapPin className="h-3 w-3 text-indigo-400" />
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
