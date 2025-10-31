import { GoogleGenerativeAI } from '@google/generative-ai'

export async function summarizeText(text) {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    const genai=new GoogleGenerativeAI(apiKey)

    const model=genai.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `Summarize the following text with all the details:\n\n${text}`;

    const result= await model.generateContent(prompt);

  const summary =
    result.response.text() ||
    "No summary generated.";

  return summary;
}
