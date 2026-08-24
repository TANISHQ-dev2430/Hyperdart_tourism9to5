import React, { useState, useEffect } from 'react';
import { Key, Check, ExternalLink } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onSaveApiKey }) {
  const [apiKeyVal, setApiKeyVal] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('geoapify_api_key') || '';
    setApiKeyVal(stored);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('geoapify_api_key', apiKeyVal.trim());
    onSaveApiKey(apiKeyVal.trim());
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('geoapify_api_key');
    setApiKeyVal('');
    onSaveApiKey('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Key className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Geoapify Places API Key</h3>
            <p className="text-xs text-slate-400">Configure your live key or use built-in mock fallback</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Geoapify provides live place data for tourism sights (`tourism.sights`). Generate a free key at{' '}
          <a
            href="https://www.geoapify.com/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 underline hover:text-indigo-300 inline-flex items-center"
          >
            geoapify.com <ExternalLink className="h-3 w-3 ml-0.5" />
          </a>.
        </p>

        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            API Key:
          </label>
          <input
            type="text"
            value={apiKeyVal}
            onChange={(e) => setApiKeyVal(e.target.value)}
            placeholder="Paste your Geoapify API key here..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            Reset to Mock Mode
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
          >
            <Check className="h-4 w-4" />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
