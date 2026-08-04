import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const DEFAULT_SAFETY_ADVICE = {
  tips: ["Stay aware of surroundings", "Keep valuables secure", "Use registered taxis"],
  essentials: ["First aid kit", "Medications", "Travel insurance"],
  emergencyContacts: ["Police: 100", "Emergency: 112"],
  rating: 7.5,
};

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
    }

    const body = await req.json();
    const { destination } = body;

    if (!destination || typeof destination !== 'string' || destination.trim() === '') {
      return NextResponse.json(
        { error: "Valid destination is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a travel safety expert for Indian destinations.
    Provide safety advice for travelers visiting ${destination}.
    
    Return JSON format ONLY:
    {
      "tips": ["tip1", "tip2", "tip3"],
      "essentials": ["item1", "item2", "item3"],
      "emergencyContacts": ["contact1", "contact2"],
      "rating": 8.5
    }
    
    No other text, just valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    // Parse JSON response with error handling
    let safetyAdvice = DEFAULT_SAFETY_ADVICE;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch && jsonMatch[0]) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate parsed response has required fields
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.tips)) {
          safetyAdvice = parsed;
        }
      }
    } catch (parseError) {
      console.error("Failed to parse safety advice JSON:", parseError);
      // Return default advice if parsing fails
    }

    return NextResponse.json(safetyAdvice, { status: 200 });
  } catch (error) {
    console.error("Safety API Error:", {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: "Failed to fetch safety advice" },
      { status: 500 }
    );
  }
}
