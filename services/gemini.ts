
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

/**
 * 🤖 GEMINI AI SERVICE
 * Optimized for professional news translation and summarization.
 */

export const translateText = async (text: string, from: 'bn' | 'en', to: 'bn' | 'en'): Promise<string> => {
  if (!text || text.trim().length === 0) return "";
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.VITE_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction: `You are a professional journalistic translator for the newspaper Barta24. 
        Your primary task is to translate news content from ${from === 'bn' ? 'Bengali' : 'English'} to ${to === 'bn' ? 'Bengali' : 'English'}.
        - Maintain a formal, neutral, and journalistic tone.
        - Output ONLY the translated text without any explanations, meta-talk, or formatting notes.
        - If the input text is related to sensitive news topics, you MUST still translate it objectively. 
        - If you cannot translate, return an empty string.`,
        temperature: 0.1,
        topP: 0.95,
      }
    });

    const translatedText = response.text?.trim();
    
    // Safety check: if result is same as input for long text, it's likely a failure/refusal
    if (translatedText === text.trim() && text.length > 20) {
      console.warn("Gemini returned identical text for translation. Possible refusal or bypass.");
    }

    return translatedText || text;
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
      contents: content,
      config: {
        systemInstruction: `Summarize the following news article in exactly two professional sentences in ${lang === 'bn' ? 'Bengali' : 'English'}. Return only the summary.`,
      }
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "";
  }
};