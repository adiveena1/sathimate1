/**
 * Sathimate AI Service
 * Main client for interacting with Sathimate AI features
 */

export interface AIResponse {
  reply: string;
  recommendations?: string[];
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface TravelRecommendation {
  destination: string;
  reason: string;
  bestTime: string;
  estimatedBudget: string;
  groupSize: number;
  activities: string[];
}

export interface SafetyAdvice {
  tips: string[];
  essentials: string[];
  emergencyContacts: string[];
  rating: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Chat API - General travel assistance
export async function askTravelAdvisor(message: string, history: ChatMessage[] = []): Promise<AIResponse> {
  const response = await fetch('/api/sathimate/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error(`Chat API Error: ${response.statusText}`);
  }

  return response.json();
}

// Recommendations API - Get personalized travel recommendations
export async function getTravelRecommendations(
  preferences: {
    budget: 'budget' | 'mid-range' | 'luxury';
    travelStyle: 'adventure' | 'culture' | 'nature' | 'mixed';
    duration: number; // in days
    groupSize: number;
    interests?: string[];
  }
): Promise<TravelRecommendation[]> {
  const response = await fetch('/api/sathimate/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    throw new Error(`Recommendations API Error: ${response.statusText}`);
  }

  return response.json();
}

// Group Matching API - Find compatible travel companions
export async function findCompatibleGroups(
  userId: string,
  preferences: {
    destination?: string;
    budget?: string;
    travelStyle?: string;
    safetyPref?: string;
  }
): Promise<any[]> {
  const response = await fetch('/api/sathimate/group-matching', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, preferences }),
  });

  if (!response.ok) {
    throw new Error(`Group Matching API Error: ${response.statusText}`);
  }

  return response.json();
}

// Safety API - Get safety advice for destinations
export async function getSafetyAdvice(destination: string): Promise<SafetyAdvice> {
  const response = await fetch('/api/sathimate/safety', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination }),
  });

  if (!response.ok) {
    throw new Error(`Safety API Error: ${response.statusText}`);
  }

  return response.json();
}

// Itinerary API - Generate detailed travel itineraries
export async function generateItinerary(
  destination: string,
  days: number,
  interests: string[],
  budget: string
): Promise<any> {
  const response = await fetch('/api/sathimate/itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, days, interests, budget }),
  });

  if (!response.ok) {
    throw new Error(`Itinerary API Error: ${response.statusText}`);
  }

  return response.json();
}

// Budget Optimization API - Get cost-saving tips
export async function optimizeBudget(
  destination: string,
  numberOfPeople: number,
  totalBudget: number,
  tripDays: number
): Promise<any> {
  const response = await fetch('/api/sathimate/budget-optimizer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, numberOfPeople, totalBudget, tripDays }),
  });

  if (!response.ok) {
    throw new Error(`Budget Optimizer API Error: ${response.statusText}`);
  }

  return response.json();
}

// Verification Helper - Check if user/profile is verified
export async function verifyUserProfile(userId: string): Promise<{
  verified: boolean;
  trustScore: number;
  badges: string[];
}> {
  const response = await fetch('/api/sathimate/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(`Verification API Error: ${response.statusText}`);
  }

  return response.json();
}
