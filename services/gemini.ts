
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAquaAssistantResponse = async (history: ChatMessage[], userInput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: "You are AI Aqua, a helpful assistant specialized in water conservation and SDG 6 (Clean Water and Sanitation). Provide concise, encouraging, and accurate information about lakes, water quality, and sustainability. Keep responses relatively short.",
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I'm having trouble connecting right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong. Please check your connection and try again.";
  }
};
