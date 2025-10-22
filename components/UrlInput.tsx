
import React from 'react';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl, onSubmit, disabled }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        className="flex-grow bg-slate-800 text-slate-200 px-4 py-3 rounded-md border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        disabled={disabled}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={disabled}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
        <span>Learn</span>
      </button>
    </form>
  );
};