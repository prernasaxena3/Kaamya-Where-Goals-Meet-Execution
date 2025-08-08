import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateAISuggestions } from "./aiSuggestions";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
console.log("API_KEY from Vite env:", API_KEY);

// Function to list available models (using direct fetch)
async function listAvailableModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.error.message}`
      );
    }
    const data = await response.json();
    console.log("Available Gemini Models (via direct fetch):");
    data.models.forEach((model) => {
      console.log(`- Name: ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(
        `  Supported Methods: ${model.supportedGenerationMethods?.join(", ")}`
      );
      console.log("---");
    });
  } catch (error) {
    console.error("Error listing models via direct fetch:", error);
  }
}

listAvailableModels();

export async function getGeminiResponse(prompt, todos = []) {
  try {
    // We already know from prior debugging that 'gemini-pro' might not be directly available
    // and 'gemini-1.0-pro' is a safer bet for general text generation.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    const text = response.text();

    const extractedSuggestions = extractSuggestions(text);
    const fallbackSuggestions = generateAISuggestions(todos);

    const finalSuggestions =
      extractedSuggestions.length > 0
        ? extractedSuggestions
        : fallbackSuggestions.map((s) => s.title);

    return {
      content: text,
      suggestions: finalSuggestions,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      content: "Sorry, something went wrong while talking to the assistant.",
      suggestions: generateAISuggestions(todos).map((s) => s.title),
    };
  }
}

function extractSuggestions(text) {
  const lines = text.split("\n");
  return lines
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => line.replace("- ", "").trim())
    .slice(0, 3);
}
