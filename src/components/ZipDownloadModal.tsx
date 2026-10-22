import React, { useState } from 'react';
import { 
  Download, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Package, 
  Terminal, 
  FileCode, 
  Sparkles,
  Loader2
} from 'lucide-react';

interface ZipDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipDownloadModal: React.FC<ZipDownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Trigger download via direct window / link navigation to /api/download-zip
      const link = document.createElement('a');
      link.href = '/api/download-zip';
      link.download = 'manager-nol-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloaded(true);
    } catch (err) {
      console.error('Download trigger error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#0c1812] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.2)] text-slate-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <Package className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold tracking-wider">
              Complete Project Export
            </span>
            <h3 className="font-['Big_Shoulders_Display'] text-3xl font-black uppercase text-white leading-tight">
              Download ZIP For Bolt.new
            </h3>
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 mb-6 space-y-3 text-xs font-mono">
          <div className="text-slate-300 flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-500">Project Archive:</span>
            <span className="font-bold text-white">manager-nol-project.zip</span>
          </div>
          <div className="text-slate-300 flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-500">Included Architecture:</span>
            <span className="text-emerald-400 font-bold">Express + Vite + React 19 + Tailwind v4</span>
          </div>
          <div className="text-slate-300 flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-500">World Seed Data:</span>
            <span className="font-bold text-white">Exactly 30 Servers & 900 Clubs Initialized</span>
          </div>
          <div className="text-slate-300 flex items-center justify-between">
            <span className="text-slate-500">Warchest Allocation:</span>
            <span className="text-amber-400 font-bold">Strict €100,000,000 per Club</span>
          </div>
        </div>

        {/* Instructions for Bolt.new */}
        <div className="space-y-4 mb-6">
          <h4 className="font-['Big_Shoulders_Display'] text-xl font-bold uppercase text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>How to Open in Bolt.new</span>
          </h4>

          <ol className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-3 p-3 rounded-xl bg-[#09150f] border border-white/5">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>
                Click <strong>&ldquo;Download Project ZIP&rdquo;</strong> below to receive the complete, pristine project directory containing <code>package.json</code>, <code>server.ts</code>, <code>src/</code>, and all seed files.
              </span>
            </li>

            <li className="flex items-start gap-3 p-3 rounded-xl bg-[#09150f] border border-white/5">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>
                Navigate to <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-semibold">https://bolt.new</a>.
              </span>
            </li>

            <li className="flex items-start gap-3 p-3 rounded-xl bg-[#09150f] border border-white/5">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>
                Drag and drop <code>manager-nol-project.zip</code> into the Bolt prompt window, or extract and import the folder.
              </span>
            </li>

            <li className="flex items-start gap-3 p-3 rounded-xl bg-[#09150f] border border-white/5">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <span>
                Bolt will automatically install dependencies and launch the full-stack server on port 3000 via <code>npm run dev</code>.
              </span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full sm:flex-1 py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing ZIP Archive...</span>
              </>
            ) : downloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Download Again (manager-nol-project.zip)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Complete ZIP</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-6 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
