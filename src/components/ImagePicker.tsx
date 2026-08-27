'use client';

// Seletor de imagem com preview: botao compacto + thumbnail do arquivo.
import { useEffect, useState } from 'react';

export default function ImagePicker({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-3">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="preview"
            className="h-16 w-16 rounded-xl border border-line object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-line text-gray-600">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.5" />
              <path d="M3 17l5-4 4 3 4-4 5 5" />
            </svg>
          </div>
        )}
        <label className="btn-outline cursor-pointer px-3 py-1.5 text-sm">
          {file ? 'Change' : 'Choose image'}
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
          />
        </label>
        {file && (
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-red-400"
            onClick={() => onChange(null)}
          >
            remove
          </button>
        )}
      </div>
    </div>
  );
}
