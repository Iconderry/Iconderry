import React from 'react';
import { X, Check, Save, Tag, Folder, FileText, Type, Package, Loader2 } from 'lucide-react';

export default function EditAssetDetailsModal({
  isOpen,
  asset,
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  tags,
  setTags,
  pack,
  setPack,
  isSaving,
  error,
  success,
  onClose,
  onSave,
  appTheme = 'dark',
}) {
  if (!isOpen || !asset) return null;

  const isDark = appTheme === 'dark';

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 flex flex-col max-h-[90vh] ${
          isDark
            ? 'bg-[#13151b] border-slate-700/80 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isDark ? 'border-slate-800 bg-[#181a22]' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center p-2 flex-shrink-0">
              <div
                className="w-full h-full flex items-center justify-center text-purple-400 [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: asset.svg }}
              />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Edit Icon Details</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ID: <span className="font-mono text-purple-400">{asset.id}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            {success}
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(e);
          }}
          className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar"
        >
          {/* Title / Name */}
          <div>
            <label className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Type className="w-3.5 h-3.5 text-purple-400" /> Title / Name
            </label>
            <input
              type="text"
              value={title || ''}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Karate High Kick Stickman"
              className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors outline-none focus:ring-2 focus:ring-purple-500/50 ${
                isDark
                  ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
              }`}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <FileText className="w-3.5 h-3.5 text-purple-400" /> Description
            </label>
            <textarea
              rows={3}
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description for search and accessibility..."
              className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors outline-none focus:ring-2 focus:ring-purple-500/50 resize-none ${
                isDark
                  ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
              }`}
            />
          </div>

          {/* Category & Pack */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Folder className="w-3.5 h-3.5 text-purple-400" /> Category
              </label>
              <input
                type="text"
                value={category || ''}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Stickman"
                className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors outline-none focus:ring-2 focus:ring-purple-500/50 ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
                }`}
                required
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Package className="w-3.5 h-3.5 text-purple-400" /> Pack Name
              </label>
              <input
                type="text"
                value={pack || ''}
                onChange={(e) => setPack(e.target.value)}
                placeholder="e.g. Stickman"
                className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors outline-none focus:ring-2 focus:ring-purple-500/50 ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
                }`}
              />
            </div>
          </div>

          {/* Search Tags */}
          <div>
            <label className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Tag className="w-3.5 h-3.5 text-purple-400" /> Search Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags || ''}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. stickman, karate, martial arts, kick, combat"
              className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors outline-none focus:ring-2 focus:ring-purple-500/50 ${
                isDark
                  ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
              }`}
            />
            <p className={`text-[11px] mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Separate tags with commas. These tags help users discover this icon in search.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
