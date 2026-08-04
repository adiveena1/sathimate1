'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  askTravelAdvisor,
  getTravelRecommendations,
  getSafetyAdvice,
  generateItinerary,
  optimizeBudget,
} from '@/lib/sathimate-ai';

export function SathimateAIHub() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'safety' | 'itinerary' | 'budget'>('chat');
  const [loading, setLoading] = useState(false);

  // Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  // Recommendations State
  const [recBudget, setRecBudget] = useState('mid-range');
  const [recStyle, setRecStyle] = useState('adventure');
  const [recDuration, setRecDuration] = useState(5);
  const [recGroupSize, setRecGroupSize] = useState(3);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Safety State
  const [safetyDestination, setSafetyDestination] = useState('');
  const [safetyAdvice, setSafetyAdvice] = useState<any>(null);

  // Itinerary State
  const [itineraryDestination, setItineraryDestination] = useState('');
  const [itineraryDays, setItineraryDays] = useState(5);
  const [itinerary, setItinerary] = useState<any>(null);

  // Budget State
  const [budgetDestination, setBudgetDestination] = useState('');
  const [budgetAmount, setBudgetAmount] = useState(10000);
  const [budgetPeople, setBudgetPeople] = useState(3);
  const [budgetDays, setBudgetDays] = useState(5);
  const [budgetResult, setBudgetResult] = useState<any>(null);

  const handleChat = async () => {
    if (!chatMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await askTravelAdvisor(chatMessage);
      setChatResponse(response.reply);
      setChatMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendations = async () => {
    setLoading(true);
    try {
      const recs = await getTravelRecommendations({
        budget: recBudget as any,
        travelStyle: recStyle as any,
        duration: recDuration,
        groupSize: recGroupSize,
      });
      setRecommendations(recs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get recommendations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSafety = async () => {
    if (!safetyDestination.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a destination',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const advice = await getSafetyAdvice(safetyDestination);
      setSafetyAdvice(advice);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get safety advice',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItinerary = async () => {
    if (!itineraryDestination.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a destination',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const itin = await generateItinerary(
        itineraryDestination,
        itineraryDays,
        [],
        'mid-range'
      );
      setItinerary(itin);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate itinerary',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBudget = async () => {
    if (!budgetDestination.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a destination',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await optimizeBudget(
        budgetDestination,
        budgetPeople,
        budgetAmount,
        budgetDays
      );
      setBudgetResult(result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to optimize budget',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Sathimate AI Hub</h1>
        <p className="text-sm opacity-90">Your intelligent travel companion</p>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {(['chat', 'recommendations', 'safety', 'itinerary', 'budget'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab)}
            className="capitalize text-xs md:text-sm"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-4 bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold">Ask Travel Advisor</h2>
          <Textarea
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask anything about travel in India..."
            className="min-h-24"
          />
          <Button onClick={handleChat} disabled={loading}>
            {loading ? 'Thinking...' : 'Get Response'}
          </Button>
          {chatResponse && (
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-sm">{chatResponse}</p>
            </div>
          )}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4 bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold">Get Recommendations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Budget</label>
              <Select value={recBudget} onValueChange={setRecBudget}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid-range">Mid-range</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Style</label>
              <Select value={recStyle} onValueChange={setRecStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Days</label>
              <Input
                type="number"
                value={recDuration}
                onChange={(e) => setRecDuration(parseInt(e.target.value))}
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Group Size</label>
              <Input
                type="number"
                value={recGroupSize}
                onChange={(e) => setRecGroupSize(parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>
          </div>
          <Button onClick={handleRecommendations} disabled={loading}>
            {loading ? 'Generating...' : 'Get Recommendations'}
          </Button>
          {recommendations.length > 0 && (
            <div className="grid gap-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="bg-blue-50 p-4 rounded border border-blue-200">
                  <h3 className="font-bold">{rec.destination}</h3>
                  <p className="text-sm text-gray-600">{rec.reason}</p>
                  <p className="text-sm font-semibold mt-2">Budget: {rec.estimatedBudget}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Safety Tab */}
      {activeTab === 'safety' && (
        <div className="space-y-4 bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold">Safety Advice</h2>
          <Input
            value={safetyDestination}
            onChange={(e) => setSafetyDestination(e.target.value)}
            placeholder="Enter destination..."
          />
          <Button onClick={handleSafety} disabled={loading}>
            {loading ? 'Loading...' : 'Get Safety Tips'}
          </Button>
          {safetyAdvice && (
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <div>
                <p className="font-semibold text-sm">Safety Tips:</p>
                <ul className="text-sm list-disc pl-5 mt-1">
                  {safetyAdvice.tips?.map((tip: string, i: number) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm">
                <strong>Safety Rating:</strong> {safetyAdvice.rating}/10
              </p>
            </div>
          )}
        </div>
      )}

      {/* Itinerary Tab */}
      {activeTab === 'itinerary' && (
        <div className="space-y-4 bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold">Generate Itinerary</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              value={itineraryDestination}
              onChange={(e) => setItineraryDestination(e.target.value)}
              placeholder="Destination..."
            />
            <Input
              type="number"
              value={itineraryDays}
              onChange={(e) => setItineraryDays(parseInt(e.target.value))}
              placeholder="Days..."
              min="1"
              max="30"
            />
          </div>
          <Button onClick={handleItinerary} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Itinerary'}
          </Button>
          {itinerary && (
            <div className="bg-purple-50 p-4 rounded border border-purple-200 space-y-3">
              <h3 className="font-bold">{itinerary.title}</h3>
              <p className="text-sm font-semibold">Total Cost: {itinerary.totalEstimatedCost}</p>
              <div className="text-xs space-y-2">
                {itinerary.days?.slice(0, 3).map((day: any, i: number) => (
                  <div key={i} className="bg-white p-2 rounded">
                    <p className="font-semibold">Day {day.day}: {day.title}</p>
                    <p>{day.activities?.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-4 bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold">Budget Optimizer</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              value={budgetDestination}
              onChange={(e) => setBudgetDestination(e.target.value)}
              placeholder="Destination..."
            />
            <Input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(parseInt(e.target.value))}
              placeholder="Total Budget (₹)"
            />
            <Input
              type="number"
              value={budgetPeople}
              onChange={(e) => setBudgetPeople(parseInt(e.target.value))}
              placeholder="People"
              min="1"
            />
            <Input
              type="number"
              value={budgetDays}
              onChange={(e) => setBudgetDays(parseInt(e.target.value))}
              placeholder="Days"
              min="1"
            />
          </div>
          <Button onClick={handleBudget} disabled={loading}>
            {loading ? 'Optimizing...' : 'Optimize Budget'}
          </Button>
          {budgetResult && (
            <div className="bg-green-50 p-4 rounded border border-green-200 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Per Person</p>
                  <p className="font-bold text-lg">₹{budgetResult.perPersonBudget}</p>
                </div>
                <div>
                  <p className="text-gray-600">Per Day</p>
                  <p className="font-bold text-lg">₹{budgetResult.budgetPerDay}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-green-700">{budgetResult.costSavings}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
