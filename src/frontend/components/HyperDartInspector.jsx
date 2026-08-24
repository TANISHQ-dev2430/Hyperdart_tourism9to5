import React, { useState } from 'react';
import { Terminal, Copy, Check, Cpu } from 'lucide-react';

export default function HyperDartInspector({ searchData, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !searchData) return null;

  const jsonString = JSON.stringify(searchData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const entity = searchData.entities?.[0]?.entityInfo?.geo || {};
  const matchedKeyword = searchData.keyword?.[0]?.word || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-purple-500/20">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                HyperDart Developer & NER Inspector
                <span className="px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                  searchData Payload
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Inspect Named Entity Recognition (NER) output and query parameters passed to component
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-800 bg-slate-950/30">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Resolved City Entity
            </span>
            <div className="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-indigo-400" />
              {entity.city || 'Unknown'}, {entity.country || ''}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              [{entity.lat?.toFixed(5)}, {entity.long?.toFixed(5)}]
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Trigger Keyword Intent
            </span>
            <div className="text-sm font-bold text-amber-400 capitalize">
              "{matchedKeyword}"
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Component: {searchData.component}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Wiki & GeoIDs
            </span>
            <div className="text-xs font-mono text-emerald-400">
              wikiQID: {searchData.entities?.[0]?.IDs?.wikiQID || 'Q60'}
            </div>
            <div className="text-xs font-mono text-emerald-400 mt-0.5">
              geonameID: {searchData.entities?.[0]?.IDs?.geonameID || '5128581'}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-emerald-400 bg-slate-950/90 leading-relaxed selection:bg-purple-900 selection:text-white">
          <pre className="whitespace-pre-wrap break-all">{jsonString}</pre>
        </div>
      </div>
    </div>
  );
}
