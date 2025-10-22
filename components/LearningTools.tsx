import React, { useState } from 'react';
import type { LearningContent, QuizQuestion } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';

interface LearningToolsProps {
  content: LearningContent;
  learningLanguage: string;
  nativeLanguage: string;
}

type Tab = 'vocabulary' | 'quiz' | 'summary';

const QuizComponent: React.FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectAnswer = (questionIndex: number, option: string) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };
  
  const getOptionClass = (questionIndex: number, option: string) => {
      if (!showResults) {
          return selectedAnswers[questionIndex] === option ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600';
      }
      const isCorrect = option === questions[questionIndex].correctAnswer;
      const isSelected = selectedAnswers[questionIndex] === option;

      if (isCorrect) return 'bg-green-600';
      if (isSelected && !isCorrect) return 'bg-red-600';
      return 'bg-slate-700 opacity-70';
  };

  const calculateScore = () => {
      return questions.reduce((score, question, index) => {
          return selectedAnswers[index] === question.correctAnswer ? score + 1 : score;
      }, 0);
  };

  return (
    <div>
      {questions.map((q, i) => (
        <div key={i} className="mb-6 p-4 bg-slate-900/50 rounded-lg">
          <p className="font-semibold text-slate-200 mb-3">{i + 1}. {q.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map((option, j) => (
              <button
                key={j}
                onClick={() => handleSelectAnswer(i, option)}
                className={`w-full text-left p-3 rounded-md transition-colors text-sm ${getOptionClass(i, option)}`}
                disabled={showResults}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-6 text-center">
        {!showResults ? (
            <button 
              onClick={() => setShowResults(true)} 
              className="bg-blue-600 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={Object.keys(selectedAnswers).length !== questions.length}
            >
                Check Answers
            </button>
        ) : (
            <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-lg font-bold">Your score: {calculateScore()} / {questions.length}</p>
                 <button onClick={() => {setShowResults(false); setSelectedAnswers({})}} className="mt-4 bg-slate-600 text-white font-bold px-4 py-2 rounded-md hover:bg-slate-700 transition">
                    Try Again
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export const LearningTools: React.FC<LearningToolsProps> = ({ content, learningLanguage, nativeLanguage }) => {
  const [activeTab, setActiveTab] = useState<Tab>('vocabulary');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'vocabulary', label: 'Vocabulary', icon: <BookOpenIcon /> },
    { id: 'quiz', label: 'Quiz', icon: <ClipboardListIcon /> },
    { id: 'summary', label: 'Summary', icon: <SparklesIcon /> },
  ];

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      <div className="flex border-b border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 p-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-700 text-blue-400'
                : 'text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6 min-h-[400px]">
        {activeTab === 'vocabulary' && (
          <div className="space-y-4">
            {content.vocabulary.map((item, index) => (
              <div key={index} className="p-4 bg-slate-900/50 rounded-md">
                <h4 className="font-bold text-lg text-blue-400">{item.word}</h4>
                <p className="text-slate-300 mt-1"><span className="font-semibold text-slate-400">Translation ({nativeLanguage}):</span> {item.translation}</p>
                <p className="text-slate-400 mt-1 text-sm"><span className="font-semibold">Definition ({learningLanguage}):</span> {item.definition}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'quiz' && <QuizComponent questions={content.quiz} />}
        {activeTab === 'summary' && (
          <div className="text-slate-300 leading-relaxed prose prose-invert">
            <p>{content.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};