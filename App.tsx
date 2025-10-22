import React, { useState, useCallback } from 'react';
import { UrlInput } from './components/UrlInput';
import { YouTubePlayer } from './components/YouTubePlayer';
import { LearningTools } from './components/LearningTools';
import { Loader } from './components/Loader';
import { LearningSettings } from './components/LearningSettings';
import { generateVocabulary, generateQuiz, generateSummary } from './services/geminiService';
import type { AppState, LearningContent } from './types';
import { AppStatus } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ status: AppStatus.IDLE });
  const [inputUrl, setInputUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null);

  const [learningLanguage, setLearningLanguage] = useState<string>('German');
  const [nativeLanguage, setNativeLanguage] = useState<string>('English');
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('Intermediate');

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlSubmit = useCallback(async () => {
    const id = extractVideoId(inputUrl);
    if (!id) {
      setAppState({ status: AppStatus.ERROR, message: 'Invalid YouTube URL. Please try again.' });
      return;
    }

    setVideoId(id);
    setAppState({ status: AppStatus.LOADING, message: 'Analyzing video and generating learning materials...' });

    try {
      const [vocabResult, quizResult, summaryResult] = await Promise.all([
        generateVocabulary(inputUrl, learningLanguage, nativeLanguage, proficiencyLevel),
        generateQuiz(inputUrl, learningLanguage, proficiencyLevel),
        generateSummary(inputUrl, learningLanguage, proficiencyLevel),
      ]);
      
      const learningContent: LearningContent = {
        vocabulary: vocabResult.vocabulary,
        quiz: quizResult.quiz,
        summary: summaryResult.summary,
      };

      setAppState({ status: AppStatus.SUCCESS, data: learningContent });
    } catch (error) {
      console.error('Error processing video:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setAppState({ status: AppStatus.ERROR, message: `Failed to process video. ${errorMessage}` });
    }
  }, [inputUrl, learningLanguage, nativeLanguage, proficiencyLevel]);

  const renderContent = () => {
    switch (appState.status) {
      case AppStatus.LOADING:
        return <Loader message={appState.message} />;
      case AppStatus.ERROR:
        return <div className="text-center text-red-400 p-8">{appState.message}</div>;
      case AppStatus.SUCCESS:
        if (!videoId) return null;
        return (
          <div className="flex flex-col items-center gap-8 mt-8 max-w-4xl mx-auto">
            <div className="w-full">
              <YouTubePlayer videoId={videoId} />
            </div>
            <div className="w-full">
              <LearningTools
                content={appState.data}
                learningLanguage={learningLanguage}
                nativeLanguage={nativeLanguage}
              />
            </div>
          </div>
        );
      case AppStatus.IDLE:
      default:
        return (
          <div className="text-center pt-16">
            <h2 className="text-3xl font-bold text-slate-200 mb-2">Learn any language, one video at a time.</h2>
            <p className="text-slate-400">Paste a YouTube URL to get started.</p>
          </div>
        );
    }
  };

  const isLoading = appState.status === AppStatus.LOADING;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            Polyglot Tube
          </h1>
        </header>
        <UrlInput
          url={inputUrl}
          setUrl={setInputUrl}
          onSubmit={handleUrlSubmit}
          disabled={isLoading}
        />
        <LearningSettings
          learningLanguage={learningLanguage}
          setLearningLanguage={setLearningLanguage}
          nativeLanguage={nativeLanguage}
          setNativeLanguage={setNativeLanguage}
          proficiencyLevel={proficiencyLevel}
          setProficiencyLevel={setProficiencyLevel}
          disabled={isLoading}
        />
        <div className="mt-4 min-h-[60vh]">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Powered by React, Tailwind CSS, and Gemini API</p>
      </footer>
    </div>
  );
};

export default App;