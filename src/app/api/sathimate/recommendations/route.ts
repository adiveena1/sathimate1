import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
    }

    const body = await req.json();
    const { budget, travelStyle, duration, groupSize, interests = [] } = body;

    if (!budget || !travelStyle || !duration || !groupSize) {
      return NextResponse.json(
        { error: "Missing required parameters: budget, travelStyle, duration, groupSize" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a travel recommendation AI for Sathimate.
    Generate 3 travel destination recommendations for Indian travelers based on:
    - Budget Level: ${budget}
    - Travel Style: ${travelStyle}
    - Trip Duration: ${duration} days
    - Group Size: ${groupSize} people
    - Interests: ${interests.join(', ') || 'mixed'}
    
    For each recommendation provide JSON format:
    {
      "destination": "place name",
      "reason": "why it's good",
      "bestTime": "best season",
      "estimatedBudget": "per person cost",
      "activities": ["activity1", "activity2"]
    }
    
    Return ONLY a JSON array, no other text.`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    // Parse and clean response with error handling
    let recommendations: any[] = [];
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch && jsonMatch[0]) {
        const parsed = JSON.parse(jsonMatch[0]);
        recommendations = Array.isArray(parsed) ? parsed : [];
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return empty array if parsing fails instead of crashing
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Recommendations API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
