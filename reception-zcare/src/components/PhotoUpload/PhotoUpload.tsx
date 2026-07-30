import { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
  photoUrl: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PhotoUpload({ photoUrl, onUpload }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center shrink-0 pt-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onUpload}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className="w-28 h-28 rounded-full border-2 border-dashed border-[#a5e4cb] bg-[#effaf5] hover:bg-[#e4f6ed] flex flex-col items-center justify-center text-[#05b875] transition-all cursor-pointer shadow-xs group overflow-hidden relative"
        aria-label="Upload patient photo"
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Patient preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <ImageIcon className="w-7 h-7 stroke-[1.8] group-hover:scale-110 transition-transform" />
        )}
      </button>
      <button
        type="button"
        onClick={handleClick}
        className="mt-3 text-xs font-bold text-[#05b875] hover:underline"
      >
        Upload Photo
      </button>
    </div>
  );
}
