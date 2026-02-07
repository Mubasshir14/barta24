
import { GoogleGenAI } from "@google/genai";

// Use a more robust way to get API key in Vite
const getApiKey = () => {
  const env = (import.meta as any).env || {};
  return env.VITE_API_KEY || (typeof process !== 'undefined' ? process.env.VITE_API_KEY || process.env.API_KEY : '');
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const translateText = async (text: string, from: 'bn' | 'en', to: 'bn' | 'en'): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return text;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following text from ${from === 'bn' ? 'Bengali' : 'English'} to ${to === 'bn' ? 'Bengali' : 'English'}. Keep the tone journalistic and professional. Only return the translated text:\n\n${text}`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text; // Fallback to original
  }
};

export const generateSummary = async (content: string, lang: 'bn' | 'en'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this news article in 2 sentences in ${lang === 'bn' ? 'Bengali' : 'English'}:\n\n${content}`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    return "";
  }
};
