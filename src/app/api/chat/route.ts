import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is missing. Check your .env setup." }, { status: 500 });
    }

    let message: string;
    try {
      const body = await req.json();
      message = body?.message;
      
      if (!message || typeof message !== 'string') {
        return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 });
      }
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid request body. Expected JSON with 'message' field." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert travel planner for an Indian social website called 'Sathimate'. 
    Sathimate lets Indian travelers connect with verified partners, split costs, and explore with confidence.
    Help the user plan their trips around India. Keep the response friendly, organized, and concise. 
    User's request: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const text = response.text();
    if (!text) {
      return NextResponse.json({ error: "No response from AI model" }, { status: 500 });
    }
    
    return NextResponse.json({ reply: text });
    
  } catch (error) {
    console.error("Gemini Error:", {
      message: error instanceof Error ? error.message : String(error),
      error,
    });
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
  }
}
