// Constants and sample data for Sathimate onboarding
export const TRAVEL_STYLES = [
  { value: 'budget', label: 'Budget', icon: '💰' },
  { value: 'luxury', label: 'Luxury', icon: '✨' },
  { value: 'backpacking', label: 'Backpacking', icon: '🎒' },
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'solo', label: 'Solo', icon: '🚶' },
  { value: 'group', label: 'Group', icon: '👥' },
];

export const INTERESTS = [
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'mountains', label: 'Mountains', icon: '⛰️' },
  { value: 'temples', label: 'Temples', icon: '🕌' },
  { value: 'cafes', label: 'Cafes', icon: '☕' },
  { value: 'beaches', label: 'Beaches', icon: '🏖️' },
  { value: 'culture', label: 'Culture', icon: '🎭' },
  { value: 'nightlife', label: 'Nightlife', icon: '🎉' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'history', label: 'History', icon: '📚' },
];

export const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'mandarin', label: 'Mandarin' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'italian', label: 'Italian' },
  { value: 'korean', label: 'Korean' },
];

export const SAMPLE_TRAVELERS = [
  {
    userId: 'user1',
    fullName: 'Priya Sharma',
    age: 26,
    gender: 'female',
    city: 'Bangalore',
    country: 'India',
    destination: 'Bali',
    travelDates: { start: new Date('2024-04-01'), end: new Date('2024-04-15') },
    travelStyle: ['adventure', 'backpacking'],
    interests: ['nature', 'photography', 'culture'],
    bio: 'Adventure seeker from Bangalore. Love exploring offbeat destinations!',
    photoURL: 'https://i.pravatar.cc/300?img=1',
    languages: ['english', 'hindi'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isProfileComplete: true,
  },
  {
    userId: 'user2',
    fullName: 'Arjun Verma',
    age: 29,
    gender: 'male',
    city: 'Mumbai',
    country: 'India',
    destination: 'Bali',
    travelDates: { start: new Date('2024-04-01'), end: new Date('2024-04-20') },
    travelStyle: ['luxury', 'adventure'],
    interests: ['beaches', 'food', 'nightlife'],
    bio: 'Travel enthusiast exploring new cultures. Always up for good conversations!',
    photoURL: 'https://i.pravatar.cc/300?img=2',
    languages: ['english', 'hindi'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isProfileComplete: true,
  },
  {
    userId: 'user3',
    fullName: 'Emma Wilson',
    age: 24,
    gender: 'female',
    city: 'Sydney',
    country: 'Australia',
    destination: 'Goa',
    travelDates: { start: new Date('2024-03-15'), end: new Date('2024-04-10') },
    travelStyle: ['backpacking', 'solo'],
    interests: ['beaches', 'culture', 'photography'],
    bio: 'Aussie traveler exploring India. Love beach vibes and local food!',
    photoURL: 'https://i.pravatar.cc/300?img=3',
    languages: ['english'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isProfileComplete: true,
  },
];

export const POPULAR_DESTINATIONS = [
  'Bali',
  'Goa',
  'Jaipur',
  'Kerala',
  'Manali',
  'Darjeeling',
  'Thailand',
  'Nepal',
  'Bhutan',
  'Sri Lanka',
];

export const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

export const COUNTRIES = [
  'India',
  'Thailand',
  'Nepal',
  'Bhutan',
  'Sri Lanka',
  'Indonesia',
  'Vietnam',
  'Cambodia',
  'Myanmar',
  'Malaysia',
];

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];
