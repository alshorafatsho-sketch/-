import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const startChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
};

export const addTashkeelToText = async (text: string): Promise<string> => {
  if (!text.trim()) return text;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // Prompt designed to add vowels while preserving original punctuation and structure.
      contents: `أضف التشكيل الكامل والدقيق على النص التالي مع الحفاظ على علامات الترقيم الأصلية تمامًا. لا تقم بإضافة أي علامات اقتباس حول النص المُعاد:\n\n${text}`,
    });
    // Return the voweled text, cleaning up any potential extra whitespace.
    return response.text.trim();
  } catch (error) {
    console.error("Error adding Tashkeel:", error);
    // If the API call fails, return the original text to avoid breaking the feature.
    return text;
  }
};
