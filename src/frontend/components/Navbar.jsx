import React from 'react';
import { Compass, Key, Code, Bookmark } from 'lucide-react';

export default function Navbar({
  hasApiKey,
  onOpenApiKeyModal,
  showInspector,
  onToggleInspector,
  onOpenTripsDrawer,
  savedTripsCount = 0
}) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Compass className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Tourism Explorer
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                @hyperdart/tourismexplorer
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              HyperDart Standalone Component Engine
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              hasApiKey
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
            }`}
            title="Configure Geoapify Places API Key"
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden md:inline">
              {hasApiKey ? 'Geoapify Active' : 'Demo Mode (Mock API)'}
            </span>
          </button>

          <button
            onClick={onToggleInspector}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              showInspector
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/25'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80 hover:text-white'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">HyperDart JSON Inspector</span>
          </button>

          <button
            onClick={onOpenTripsDrawer}
            className="relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/20 transition-all"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Trips</span>
            {savedTripsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-white text-indigo-700 rounded-full">
                {savedTripsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
