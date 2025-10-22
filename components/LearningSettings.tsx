import React from 'react';

interface LearningSettingsProps {
  learningLanguage: string;
  setLearningLanguage: (lang: string) => void;
  nativeLanguage: string;
  setNativeLanguage: (lang: string) => void;
  proficiencyLevel: string;
  setProficiencyLevel: (level: string) => void;
  disabled: boolean;
}

export const LearningSettings: React.FC<LearningSettingsProps> = ({
  learningLanguage,
  setLearningLanguage,
  nativeLanguage,
  setNativeLanguage,
  proficiencyLevel,
  setProficiencyLevel,
  disabled,
}) => {
  return (
    <div className="max-w-2xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label htmlFor="learning-language" className="block text-sm font-medium text-slate-400 mb-1">
          Learning Language
        </label>
        <input
          id="learning-language"
          type="text"
          value={learningLanguage}
          onChange={(e) => setLearningLanguage(e.target.value)}
          placeholder="e.g., German"
          className="w-full bg-slate-800 text-slate-200 px-3 py-2 rounded-md border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          disabled={disabled}
        />
      </div>
      <div>
        <label htmlFor="native-language" className="block text-sm font-medium text-slate-400 mb-1">
          Native Language
        </label>
        <input
          id="native-language"
          type="text"
          value={nativeLanguage}
          onChange={(e) => setNativeLanguage(e.target.value)}
          placeholder="e.g., English"
          className="w-full bg-slate-800 text-slate-200 px-3 py-2 rounded-md border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          disabled={disabled}
        />
      </div>
      <div>
        <label htmlFor="proficiency-level" className="block text-sm font-medium text-slate-400 mb-1">
          Proficiency Level
        </label>
        <div className="relative">
          <select
            id="proficiency-level"
            value={proficiencyLevel}
            onChange={(e) => setProficiencyLevel(e.target.value)}
            className="w-full bg-slate-800 text-slate-200 px-3 py-2 rounded-md border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition appearance-none"
            disabled={disabled}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
