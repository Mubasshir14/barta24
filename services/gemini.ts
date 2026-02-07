
// import { GoogleGenAI } from "@google/genai";

// const getApiKey = () => {
//   const env = (import.meta as any).env || {};
//   return env.VITE_API_KEY || (typeof process !== 'undefined' ? process.env.VITE_API_KEY || process.env.API_KEY : '');
// };

// const ai = new GoogleGenAI({ apiKey: getApiKey() });

// export const translateText = async (text: string, from: 'bn' | 'en', to: 'bn' | 'en'): Promise<string> => {
//   try {
//     const apiKey = getApiKey();
//     if (!apiKey) return text;

//     const response = await ai.models.generateContent({
//       model: 'gemini-3-flash-preview',
//       contents: `Translate the following text from ${from === 'bn' ? 'Bengali' : 'English'} to ${to === 'bn' ? 'Bengali' : 'English'}. Keep the tone journalistic and professional. Only return the translated text:\n\n${text}`,
//     });
//     return response.text?.trim() || text;
//   } catch (error) {
//     console.error("Translation Error:", error);
//     return text; 
//   }
// };

// export const generateSummary = async (content: string, lang: 'bn' | 'en'): Promise<string> => {
//   try {
//     const response = await ai.models.generateContent({
//       model: 'gemini-3-flash-preview',
//       contents: `Summarize this news article in 2 sentences in ${lang === 'bn' ? 'Bengali' : 'English'}:\n\n${content}`,
//     });
//     return response.text?.trim() || "";
//   } catch (error) {
//     return "";
//   }
// };

import { GoogleGenAI } from "@google/genai";


export const translateText = async (text: string, from: 'bn' | 'en', to: 'bn' | 'en'): Promise<string> => {
  if (!text || text.trim().length === 0) return "";
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.VITE_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional newspaper translator for Barta24. 
      Translate the following news text from ${from === 'bn' ? 'Bengali' : 'English'} to ${to === 'bn' ? 'Bengali' : 'English'}. 
      Maintain a formal, journalistic, and neutral tone. 
      Do not add any explanations or notes. Return ONLY the translated text.
      
      Text to translate:
      ${text}`,
      config: {
        temperature: 0.1, // Low temperature for factual consistency
        topP: 0.95,
      }
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return text;
  }
};

export const generateSummary = async (content: string, lang: 'bn' | 'en'): Promise<string> => {
  if (!content) return "";
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.VITE_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this news article in exactly two professional sentences in ${lang === 'bn' ? 'Bengali' : 'English'}:
      
      Content: ${content}`,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "";
  }
};