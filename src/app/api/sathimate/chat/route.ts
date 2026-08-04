import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Sathimate AI, a warm, knowledgeable, and helpful travel advisor. Your goal is to help users plan amazing trips in India. Give specific, practical answers (like recommending exact places to visit, typical travel durations, local food specialties, or transit options) rather than generic platitudes. When appropriate or when the user's request is vague, ask friendly clarifying questions to help tailor your recommendations.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (anthropicKey) {
      const anthropic = new Anthropic({ apiKey: anthropicKey });

      const formattedMessages = [
        ...history.map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content,
        })),
        { role: 'user', content: message }
      ];

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: formattedMessages,
      });

      // Properly extract the response from the LLM's content blocks filtering for type 'text'
      const reply = response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('\n');

      return NextResponse.json({ reply });

    } else if (geminiKey) {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      // Format history for Gemini chat API (role must alternate user/model starting with user)
      const geminiHistory = history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      }));

      const chat = model.startChat({
        history: geminiHistory,
      });

      const result = await chat.sendMessage(message);
      const text = result.response.text();

      return NextResponse.json({ reply: text });

    } else {
      return NextResponse.json(
        { error: "No API Key configured. Please set ANTHROPIC_API_KEY or GEMINI_API_KEY." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
