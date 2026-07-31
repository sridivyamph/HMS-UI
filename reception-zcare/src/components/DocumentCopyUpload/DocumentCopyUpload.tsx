import { useRef } from 'react';
import { Camera } from 'lucide-react';

interface DocumentCopyUploadProps {
  fileName: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
}

export function DocumentCopyUpload({
  fileName,
  onUpload,
  label = 'Document Copy',
  placeholder = 'Scan / Attach / Capture',
}: DocumentCopyUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onUpload}
        accept="image/*,.pdf"
        capture="environment"
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full min-h-[42px] rounded-xl border border-dashed border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm text-slate-500 transition-colors cursor-pointer"
        aria-label="Scan, attach, or capture document copy"
      >
        <Camera className="w-4 h-4 shrink-0 text-slate-400" />
        <span className="truncate">{fileName || placeholder}</span>
      </button>
    </div>
  );
}
