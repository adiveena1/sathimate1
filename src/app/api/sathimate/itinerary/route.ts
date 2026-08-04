import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

function getDefaultItinerary(destination: string, days: number) {
  return {
    title: `${days}-Day ${destination} Itinerary`,
    days: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      activities: ["Explore local attractions", "Visit restaurants", "Rest"],
      estimatedCost: "$50-100",
      accommodation: "3-star hotel",
      meals: ["breakfast", "lunch", "dinner"],
    })),
    totalEstimatedCost: `$${days * 75}-${days * 150}`,
  };
}

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
    }

    const body = await req.json();
    const { destination, days, interests = [], budget } = body;

    if (!destination || !days || !budget || typeof days !== 'number' || days < 1 || days > 30) {
      return NextResponse.json(
        { error: "Missing or invalid required parameters: destination, days (1-30), budget" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a travel itinerary planner for ${destination}.
    Create a ${days}-day travel itinerary for ${budget} budget travelers interested in: ${interests.join(', ')}.
    
    Return JSON format ONLY:
    {
      "title": "Itinerary title",
      "days": [
        {
          "day": 1,
          "title": "Day title",
          "activities": ["activity1", "activity2"],
          "estimatedCost": "$50-100",
          "accommodation": "Hotel name type",
          "meals": ["breakfast", "lunch", "dinner"]
        }
      ],
      "totalEstimatedCost": "$500-800"
    }
    
    Be specific and practical. Return ONLY JSON.`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    // Parse JSON response with error handling
    let itinerary = getDefaultItinerary(destination, days);
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch && jsonMatch[0]) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate parsed response has required fields
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.days) && parsed.days.length > 0) {
          itinerary = parsed;
        }
      }
    } catch (parseError) {
      console.error("Failed to parse itinerary JSON:", parseError);
      // Return default itinerary if parsing fails
    }

    return NextResponse.json(itinerary, { status: 200 });
  } catch (error) {
    console.error("Itinerary API Error:", {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
