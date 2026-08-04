import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // For now, return basic verification response
    // In production, this would query a database or auth service
    return NextResponse.json({
      verified: true,
      trustScore: 75,
      badges: ["Email Verified", "Profile Complete", "Trusted Traveler"],
      profile: {
        name: "Traveler",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`,
        bio: "Travel enthusiast",
        joinDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Verification API Error:", error);
    return NextResponse.json(
      { error: "Failed to verify user" },
      { status: 500 }
    );
  }
}

function calculateTrustScore(profile: any): number {
  let score = 50;
  if (profile.photoURL) score += 15;
  if (profile.fullName && profile.fullName.length > 2) score += 15;
  if (profile.bio && profile.bio.length > 10) score += 10;
  if (profile.isProfileComplete) score += 10;
  return Math.min(score, 100);
}

function generateBadges(profile: any): string[] {
  const badges: string[] = [];
  if (profile.photoURL) badges.push("Profile Picture");
  if (profile.bio) badges.push("Bio Added");
  if (profile.isProfileComplete) badges.push("Complete Profile");
  return badges;
}
