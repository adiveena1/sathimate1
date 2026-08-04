import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, numberOfPeople, totalBudget, tripDays } = body;

    if (!destination || !numberOfPeople || !totalBudget || !tripDays) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const perPersonBudget = totalBudget / numberOfPeople;
    const budgetPerDay = totalBudget / tripDays;
    const costSavings = calculateSavings(numberOfPeople, totalBudget);

    return NextResponse.json({
      destination,
      numberOfPeople,
      totalBudget,
      tripDays,
      perPersonBudget: Math.round(perPersonBudget * 100) / 100,
      budgetPerDay: Math.round(budgetPerDay * 100) / 100,
      breakdown: {
        accommodation: Math.round(totalBudget * 0.35),
        food: Math.round(totalBudget * 0.25),
        transport: Math.round(totalBudget * 0.25),
        activities: Math.round(totalBudget * 0.15),
      },
      costSavings,
      tips: [
        "Book accommodations in advance for better rates",
        "Travel during off-season for discounts",
        "Use public transport instead of taxis",
        "Eat at local restaurants instead of tourist spots",
        `Split costs among ${numberOfPeople} people to save more`,
      ],
    });
  } catch (error) {
    console.error("Budget Optimizer Error:", error);
    return NextResponse.json(
      { error: "Failed to optimize budget" },
      { status: 500 }
    );
  }
}

function calculateSavings(numberOfPeople: number, totalBudget: number): string {
  const savingsPercentage = Math.min(10 + numberOfPeople * 2, 30);
  const savings = Math.round((totalBudget * savingsPercentage) / 100);
  return `Save up to ₹${savings} (${savingsPercentage}%) by group booking`;
}
