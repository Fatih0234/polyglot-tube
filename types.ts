export interface VocabularyItem {
  word: string;
  definition: string;
  translation: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface LearningContent {
  vocabulary: VocabularyItem[];
  quiz: QuizQuestion[];
  summary: string;
}

export enum AppStatus {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export type AppState = 
    | { status: AppStatus.IDLE }
    | { status: AppStatus.LOADING; message: string }
    | { status: AppStatus.SUCCESS; data: LearningContent }
    | { status: AppStatus.ERROR; message: string };