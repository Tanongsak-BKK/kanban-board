import { useState, useEffect, useRef } from 'react';
import { useKanban } from '../context/KanbanContext';

export default function ConfirmModal() {
  const { dialog, closeDialog } = useKanban();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  // Sync internal input state with dialog defaultValue when it opens
  useEffect(() => {
    if (dialog.isOpen) {
      setInputValue(dialog.defaultValue || "");
      // Focus the input if it's a prompt
      if (dialog.type === 'prompt') {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  }, [dialog.isOpen, dialog.defaultValue, dialog.type]);

  if (!dialog.isOpen) return null;

  const handleConfirm = () => {
    if (dialog.type === 'prompt') {
      closeDialog(inputValue);
    } else {
      closeDialog(true);
    }
  };

  const handleCancel = () => {
    closeDialog(dialog.type === 'prompt' ? null : false);
  };

  const Icon = () => {
    switch (dialog.type) {
      case 'confirm':
        return <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 mx-auto shadow-sm border border-red-100 ring-4 ring-red-50/50">
          <i className="ph-fill ph-warning text-3xl"></i>
        </div>;
      case 'prompt':
        return <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-6 mx-auto shadow-sm border border-indigo-100 ring-4 ring-indigo-50/50">
          <i className="ph-fill ph-user-plus text-3xl"></i>
        </div>;
      case 'alert':
        return <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 mx-auto shadow-sm border border-emerald-100 ring-4 emerald-50/50">
          <i className="ph-fill ph-check-circle text-3xl"></i>
        </div>;
      default:
        return <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-6 mx-auto shadow-sm border border-blue-100 ring-4 ring-blue-50/50">
          <i className="ph-fill ph-info text-3xl"></i>
        </div>;
    }
  };

  const confirmBtnClass = dialog.type === 'confirm' 
    ? "px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-200"
    : "px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200";

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-modal-fade"
      onKeyDown={(e) => e.key === 'Escape' && handleCancel()}
    >
      <div 
        className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-sm overflow-hidden transform animate-modal-zoom border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <Icon />
          <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{dialog.title}</h3>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">{dialog.message}</p>

          {dialog.type === 'prompt' && (
            <div className="mb-8 group">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                placeholder="Type something..."
              />
            </div>
          )}

          <div className="flex gap-4 justify-center">
            {dialog.type !== 'alert' && (
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all active:scale-95 border border-transparent hover:border-slate-100"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`${confirmBtnClass} flex-1`}
            >
              {dialog.type === 'alert' ? 'Done' : dialog.type === 'prompt' ? 'Confirm' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
