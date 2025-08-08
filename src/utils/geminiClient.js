import { generateAISuggestions } from "./aiSuggestions";

// Hitting your deployed Vercel backend
const BACKEND_URL = "https://kaamya-backend.vercel.app/api/gemini";

export async function getGeminiResponse(prompt, todos = []) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    // Fallback in case backend doesn't extract suggestions
    const extractedSuggestions = extractSuggestions(data.content);
    const fallbackSuggestions = generateAISuggestions(todos);

    const finalSuggestions =
      extractedSuggestions.length > 0
        ? extractedSuggestions
        : fallbackSuggestions.map((s) => s.title);

    return {
      content: data.content,
      suggestions: finalSuggestions,
    };
  } catch (error) {
    console.error("Error calling Gemini backend:", error);
    return {
      content: "Something went wrong calling the assistant.",
      suggestions: generateAISuggestions(todos).map((s) => s.title),
    };
  }
}

// Optional: Keep the extraction logic on the frontend
function extractSuggestions(text) {
  const lines = text.split("\n");
  return lines
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => line.replace("- ", "").trim())
    .slice(0, 3);
}
