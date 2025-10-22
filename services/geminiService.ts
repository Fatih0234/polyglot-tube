import { GoogleGenAI } from "@google/genai";
import type { VocabularyItem, QuizQuestion } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const model = "gemini-2.5-pro";

const parseJsonSafely = <T>(jsonString: string): T => {
    try {
        // The model might wrap the JSON in markdown backticks, so we strip them.
        const cleanJsonString = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        return JSON.parse(cleanJsonString) as T;
    } catch (e) {
        console.error("Failed to parse JSON from AI response.", { jsonString, error: e });
        throw new Error('The AI model returned a response in an unexpected format. Please try again.');
    }
}


/**
 * Generates a list of vocabulary words from a YouTube video URL.
 */
export const generateVocabulary = async (
  youtubeUrl: string, 
  learningLanguage: string,
  nativeLanguage: string,
  proficiencyLevel: string
): Promise<{ vocabulary: VocabularyItem[] }> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: `You are a language learning assistant. Your task is to analyze the content of the provided YouTube video. Identify 10 key vocabulary words or phrases for a ${proficiencyLevel} student learning ${learningLanguage}.
For each item, provide the word in ${learningLanguage}, its definition in ${learningLanguage} (simplified for a ${proficiencyLevel} learner), and its translation in ${nativeLanguage}.

Format your entire response as a single, minified JSON array, and nothing else. The JSON object must follow this schema:
[{"word": "...", "definition": "...", "translation": "..."}, ...].
Do not include any introductory text, closing text, or markdown formatting.` },
        { fileData: { fileUri: youtubeUrl, mimeType: 'video/mp4' } }
      ],
    });

    const vocabulary = parseJsonSafely<VocabularyItem[]>(response.text);
    return { vocabulary };
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Could not generate vocabulary due to an unexpected AI model error.');
  }
};

/**
 * Generates a multiple-choice quiz from a YouTube video URL.
 */
export const generateQuiz = async (
  youtubeUrl: string, 
  learningLanguage: string,
  proficiencyLevel: string
): Promise<{ quiz: QuizQuestion[] }> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: `You are an expert language teacher. Your task is to analyze the content of the provided YouTube video. Create a multiple-choice quiz in ${learningLanguage} with 5 questions to test a ${proficiencyLevel} learner's comprehension.
Each question must have exactly 4 options, with only one being correct. The questions should focus on the main ideas and details of the video.

Format your entire response as a single, minified JSON array, and nothing else. The JSON object must follow this schema:
[{"question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..."}, ...].
The 'correctAnswer' must exactly match one of the items in the 'options' array.
Do not include any introductory text, closing text, or markdown formatting.`},
        { fileData: { fileUri: youtubeUrl, mimeType: 'video/mp4' } }
      ],
    });

    const quiz = parseJsonSafely<QuizQuestion[]>(response.text);
    return { quiz };
  } catch (error) {
    console.error("Error generating quiz:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Could not generate quiz due to an unexpected AI model error.');
  }
};


/**
 * Generates a summary from a YouTube video URL.
 */
export const generateSummary = async (
  youtubeUrl: string, 
  learningLanguage: string,
  proficiencyLevel: string
): Promise<{ summary: string }> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: `You are a helpful assistant. Analyze the provided YouTube video and provide a concise summary (about 3-4 sentences) in ${learningLanguage}. The summary should be written in simple language suitable for a ${proficiencyLevel} language learner.

Format your entire response as a single, minified JSON object, and nothing else, following this schema:
{"summary": "..."}.
Do not include any introductory text, closing text, or markdown formatting.` },
        { fileData: { fileUri: youtubeUrl, mimeType: 'video/mp4' } }
      ],
    });
    
    const result = parseJsonSafely<{ summary: string }>(response.text);
    return { summary: result.summary };
  } catch (error) {
    console.error("Error generating summary:", error);
     if (error instanceof Error) {
        throw error;
    }
    throw new Error('Could not generate a summary due to an unexpected AI model error.');
  }
};