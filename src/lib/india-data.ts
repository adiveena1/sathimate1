
import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';

// Helper to reduce boilerplate and provide a fallback
const findImage = (id: string): { imageUrl: string; imageHint: string } => {
  const img = PlaceHolderImages.find(p => p.id === id);
  if (!img) {
    console.warn(`Image with id "${id}" not found. Using placeholder.`);
    // Return a default placeholder to avoid crashes
    return { imageUrl: 'https://placehold.co/800x600?text=Image+Not+Found', imageHint: 'placeholder' };
  }
  return { imageUrl: img.imageUrl, imageHint: img.imageHint };
};


export interface Place {
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  category: 'attraction' | 'market' | 'cafe' | 'restaurant';
  rating: number;
  reviews: number;
  distance: number;
  isOpen: boolean;
}

export interface City {
  name:string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface State{
  id: string;
  name: string;
  tagline: string;
  bannerImageUrl: string;
  bannerImageHint: string;
  about: string[];
  cities: City[];
  famousPlaces: Place[];
  galleryImages: { url: string; hint: string; }[];
  travelInfo: {
    bestTimeToVisit: string;
    localFood: string;
    cultureAndFestivals: string;
  };
}

export interface PopularDestination {
  id: string;
  name: string;
  state: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  badge?: string;
  communityText?: string;
}

export const popularDestinations: PopularDestination[] = [
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    description: 'Beaches, nightlife, and Portuguese architecture.',
    ...findImage('dest-goa'),
    badge: 'Trending',
    communityText: '25+ Active Groups',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    state: 'Kerala',
    description: "God's Own Country, known for its serene backwaters and lush greenery.",
    ...findImage('dest-kerala'),
    badge: 'Trending',
    communityText: '10+ Active Groups',
  },
  {
    id: 'himachal-pradesh',
    name: 'Manali',
    state: 'Himachal Pradesh',
    description: 'A high-altitude Himalayan resort town known for adventure.',
    ...findImage('dest-manali'),
    badge: 'Adventure',
    communityText: '15 Travelers Planning',
  },
  {
    id: 'himachal-pradesh',
    name: 'Kasol',
    state: 'Himachal Pradesh',
    description: 'A Himalayan hamlet known for its scenic beauty and trekking trails.',
    ...findImage('dest-kasol'),
    badge: 'Solo Friendly',
    communityText: '18 Travelers Planning',
  },
  {
    id: 'rajasthan',
    name: 'Udaipur',
    state: 'Rajasthan',
    description: "The City of Lakes, with romantic palaces and serene waters.",
    ...findImage('dest-udaipur'),
    badge: 'Cultural',
    communityText: '8 Active Groups',
  },
  {
    id: 'uttarakhand',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    description: 'The Yoga Capital of the World, nestled in the Himalayan foothills.',
    ...findImage('dest-rishikesh'),
    badge: 'Spiritual',
    communityText: '20+ Travelers Planning',
  },
  {
    id: 'ladakh',
    name: 'Leh-Ladakh',
    state: 'Ladakh',
    description: 'High-altitude desert landscapes and Buddhist monasteries.',
    ...findImage('dest-ladakh'),
    badge: 'Adventure',
    communityText: '10 Active Groups',
  },
   {
    id: 'rajasthan',
    name: 'Jaipur',
    state: 'Rajasthan',
    description: 'The Pink City, known for its majestic palaces.',
    ...findImage('dest-jaipur'),
    badge: 'Cultural',
    communityText: '12 Active Groups',
  },
  {
    id: 'rajasthan',
    name: 'Jodhpur',
    state: 'Rajasthan',
    description: 'The Blue City, dominated by the imposing Mehrangarh Fort.',
    ...findImage('state-rajasthan-city-jodhpur'),
    badge: 'Cultural',
    communityText: '10 Active Groups',
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    state: 'Sikkim',
    description: 'The Land of Mystic Splendor, home to towering peaks and serene monasteries.',
    ...findImage('dest-sikkim'),
    badge: 'Spiritual',
    communityText: '5+ Active Groups'
  },
  {
    id: 'uttar-pradesh',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    description: 'One of the oldest living cities in the world, sacred to Hindus.',
    ...findImage('dest-varanasi'),
    badge: 'Spiritual',
    communityText: '30+ Groups Joined'
  },
  {
    id: 'uttar-pradesh',
    name: 'Agra',
    state: 'Uttar Pradesh',
    description: 'Home to the Taj Mahal, an ivory-white marble mausoleum.',
    ...findImage('dest-agra'),
    badge: 'Iconic',
    communityText: '50+ Travelers'
  },
  {
    id: 'karnataka',
    name: 'Hampi',
    state: 'Karnataka',
    description: 'Ancient temple complex and UNESCO World Heritage Site.',
    ...findImage('dest-hampi'),
    badge: 'Historical',
    communityText: '12 Active Groups'
  },
  {
    id: 'karnataka',
    name: 'Coorg',
    state: 'Karnataka',
    description: 'The Scotland of India, famous for coffee and lush greenery.',
    ...findImage('dest-coorg'),
    badge: 'Nature',
    communityText: '15 Active Groups'
  },
  {
    id: 'tamil-nadu',
    name: 'Pondicherry',
    state: 'Puducherry',
    description: 'French colonial settlement with tree-lined streets and mustard-colored houses.',
    ...findImage('dest-pondicherry'),
    badge: 'Peaceful',
    communityText: '22 Travelers'
  },
  {
    id: 'punjab',
    name: 'Amritsar',
    state: 'Punjab',
    description: 'Home to the Golden Temple, the holiest Gurdwara of Sikhism.',
    ...findImage('dest-amritsar'),
    badge: 'Spiritual',
    communityText: '25 Active Groups'
  },
  {
    id: 'meghalaya',
    name: 'Shillong',
    state: 'Meghalaya',
    description: 'The capital of Meghalaya, known as the Scotland of the East.',
    ...findImage('dest-shillong'),
    badge: 'Hills',
    communityText: '10 Active Groups'
  },
  {
    id: 'himachal-pradesh',
    name: 'Dalhousie',
    state: 'Himachal Pradesh',
    description: 'High-altitude town built on 5 hills with colonial-era churches.',
    ...findImage('dest-dalhousie'),
    badge: 'Hills',
    communityText: '8 Active Groups'
  },
  {
    id: 'west-bengal',
    name: 'Darjeeling',
    state: 'West Bengal',
    description: 'Famous for its tea industry and the Darjeeling Himalayan Railway.',
    ...findImage('dest-darjeeling'),
    badge: 'Hills',
    communityText: '14 Active Groups'
  },
  {
    id: 'rajasthan',
    name: 'Jaisalmer',
    state: 'Rajasthan',
    description: 'The Golden City, standing on a ridge of yellowish sandstone.',
    ...findImage('dest-jaisalmer'),
    badge: 'Desert',
    communityText: '20 travelers'
  },
  {
    id: 'karnataka',
    name: 'Gokarna',
    state: 'Karnataka',
    description: 'Small temple town on the western coast with beautiful beaches.',
    ...findImage('dest-gokarna'),
    badge: 'Beaches',
    communityText: '18 Active Groups'
  },
  {
    id: 'tamli-nadu',
    name: 'Kodaikanal',
    state: 'Tamil Nadu',
    description: 'Lakeside resort town with mist-covered manicured cliffs.',
    ...findImage('dest-kodaikanal'),
    badge: 'Hills',
    communityText: '11 Active Groups'
  },
  {
    id: 'tamil-nadu',
    name: 'Ooty',
    state: 'Tamil Nadu',
    description: 'Popular hill station known for its tea gardens and toy train.',
    ...findImage('dest-ooty'),
    badge: 'Hills',
    communityText: '30+ Travelers'
  },
  {
    id: 'maharashtra',
    name: 'Mumbai',
    state: 'Maharashtra',
    description: 'The City of Dreams, India’s financial capital and home to Bollywood.',
    ...findImage('dest-mumbai'),
    badge: 'City Life',
    communityText: '100+ Active Members'
  },
  {
    id: 'maharashtra',
    name: 'Lonavala',
    state: 'Maharashtra',
    description: 'A popular hill station near Mumbai and Pune, ideal for treks.',
    ...findImage('dest-lonavala'),
    badge: 'Weekend',
    communityText: '45 Active Groups'
  },
  {
    id: 'gujarat',
    name: 'Rann of Kutch',
    state: 'Gujarat',
    description: 'Large area of salt marshes, famous for the Rann Utsav festival.',
    ...findImage('dest-kutch'),
    badge: 'Iconic',
    communityText: '12 Active Groups'
  },
  {
    id: 'madhya-pradesh',
    name: 'Khajuraho',
    state: 'Madhya Pradesh',
    description: 'Famous for its stunning temples adorned with erotic sculptures.',
    ...findImage('dest-khajuraho'),
    badge: 'Historical',
    communityText: '7 Active Groups'
  },
  {
    id: 'jammu-and-kashmir',
    name: 'Srinagar',
    state: 'Jammu & Kashmir',
    description: 'Summer capital known for Dal Lake and houseboats.',
    ...findImage('dest-srinagar'),
    badge: 'Paradise',
    communityText: '28 travelers'
  },
  {
    id: 'jammu-and-kashmir',
    name: 'Gulmarg',
    state: 'Jammu & Kashmir',
    description: 'A popular skiing destination and hill station.',
    ...findImage('dest-gulmarg'),
    badge: 'Adventure',
    communityText: '16 Active Groups'
  },
  {
    id: 'andaman-and-nicobar-islands',
    name: 'Havelock Island',
    state: 'Andaman & Nicobar',
    description: 'Pristine beaches and world-class scuba diving spots.',
    ...findImage('dest-havelock'),
    badge: 'Island',
    communityText: '10 Active Groups'
  },
  {
    id: 'uttar-pradesh',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    description: 'The City of Nawabs, famous for its culture and architecture.',
    ...findImage('dest-lucknow'),
    badge: 'Cultural',
    communityText: '15 Active Groups'
  },
  {
    id: 'telangana',
    name: 'Hyderabad',
    state: 'Telangana',
    description: 'The City of Pearls, known for its biryani and the Charminar.',
    ...findImage('dest-hyderabad'),
    badge: 'City Life',
    communityText: '40+ Active Groups'
  },
  {
    id: 'karnataka',
    name: 'Bangalore',
    state: 'Karnataka',
    description: 'The Silicon Valley of India, known for its parks and nightlife.',
    ...findImage('dest-bangalore'),
    badge: 'City Life',
    communityText: '60+ Active Groups'
  },
  {
    id: 'andhra-pradesh',
    name: 'Tirupati',
    state: 'Andhra Pradesh',
    description: 'Home to the world-famous Venkateswara Temple.',
    ...findImage('dest-tirupati'),
    badge: 'Spiritual',
    communityText: '50+ travelers'
  }
];


export const indianStates: State[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    tagline: 'The Land of Kings, Palaces, and Vibrant Colors.',
    bannerImageUrl: findImage('state-rajasthan-banner').imageUrl,
    bannerImageHint: findImage('state-rajasthan-banner').imageHint,
    about: [
      'Rajasthan, literally, "Land of Kings," is India\'s largest state by area. It is located on the northwestern side of the country, where it comprises most of the wide and inhospitable Thar Desert (also known as the "Great Indian Desert").',
      'The state is famous for its majestic forts, vibrant festivals, delicious cuisine, and rich cultural heritage. From the golden sands of the Thar Desert to the beautiful lakes of Udaipur, Rajasthan offers a diverse range of experiences for every traveler.',
    ],
    cities: [
      {
        name: 'Jaipur',
        description: 'The Pink City, known for its stunning architecture and bustling bazaars.',
        ...findImage('state-rajasthan-city-jaipur'),
      },
      {
        name: 'Udaipur',
        description: 'The City of Lakes, renowned for its romantic lakeside palaces and serene boat rides.',
        ...findImage('state-rajasthan-city-udaipur'),
      },
      {
        name: 'Jodhpur',
        description: 'The Blue City, dominated by the imposing Mehrangarh Fort that overlooks the city.',
        ...findImage('state-rajasthan-city-jodhpur'),
      },
    ],
    famousPlaces: [
      {
        name: 'Hawa Mahal',
        description: 'A palace in Jaipur with a unique five-story exterior akin to a honeycomb.',
        category: 'attraction',
        rating: 4.8,
        reviews: 3200,
        distance: 1,
        isOpen: true,
        ...findImage('state-rajasthan-place-hawamahal'),
      },
      {
        name: 'Mehrangarh Fort',
        description: 'One of the largest forts in India, located in Jodhpur, offering breathtaking views.',
        category: 'attraction',
        rating: 4.9,
        reviews: 4500,
        distance: 5,
        isOpen: true,
        ...findImage('state-rajasthan-place-mehrangarh'),
      },
      {
        name: 'Lake Pichola',
        description: 'An artificial fresh water lake in Udaipur, home to the famous Lake Palace.',
        category: 'attraction',
        rating: 4.7,
        reviews: 2800,
        distance: 3,
        isOpen: true,
        ...findImage('state-rajasthan-place-pichola'),
      },
      {
        name: 'Johari Bazaar',
        description: 'One of the oldest and busiest markets in Jaipur, famous for jewelry.',
        category: 'market',
        rating: 4.5,
        reviews: 1500,
        distance: 1.2,
        isOpen: true,
        ...findImage('state-rajasthan-place-joharibazaar'),
      },
    ],
    galleryImages: [
      { url: findImage('state-rajasthan-gallery-1').imageUrl, hint: findImage('state-rajasthan-gallery-1').imageHint },
      { url: findImage('state-rajasthan-gallery-2').imageUrl, hint: findImage('state-rajasthan-gallery-2').imageHint },
      { url: findImage('state-rajasthan-gallery-3').imageUrl, hint: findImage('state-rajasthan-gallery-3').imageHint },
    ],
    travelInfo: {
      bestTimeToVisit: 'October to March, when the weather is pleasant and cool.',
      localFood: 'Dal Baati Churma, Laal Maas, Ghewar, and various spicy curries.',
      cultureAndFestivals: 'Famous for the Pushkar Fair, Jaipur Literature Festival, and vibrant Holi celebrations.',
    },
  },
  {
    id: 'kerala',
    name: 'Kerala',
    tagline: "God's Own Country, a tapestry of green landscapes and serene backwaters.",
    bannerImageUrl: findImage('state-kerala-banner').imageUrl,
    bannerImageHint: findImage('state-kerala-banner').imageHint,
    about: [
        'Kerala, a state on India\'s tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline. It\'s known for its palm-lined beaches and backwaters, a network of canals. Inland are the Western Ghats, mountains whose slopes support tea, coffee and spice plantations as well as wildlife.',
        'National parks like Eravikulam and Periyar, plus Wayanad and other sanctuaries, are home to elephants, langur monkeys and tigers. The state is a world away from the frenzy of the rest of India, its long, fascinating backstory nicely complementing its laid-back vibe.'
    ],
    cities: [
      {
        name: 'Kochi (Cochin)',
        description: 'A vibrant city that has been a port since 1341, with a rich mix of cultural influences.',
        ...findImage('state-kerala-city-kochi'),
      },
      {
        name: 'Munnar',
        description: 'A hill station famous for its vast tea estates, rolling hills, and pleasant climate.',
        ...findImage('state-kerala-city-munnar'),
      },
      {
        name: 'Alleppey (Alappuzha)',
        description: 'The hub of Kerala\'s backwaters, home to a vast network of canals and houseboats.',
        ...findImage('state-kerala-city-alleppey'),
      },
    ],
    famousPlaces: [
      {
        name: 'Kerala Backwaters',
        description: 'A serene network of lakes, canals, and lagoons. Best experienced on a houseboat.',
        category: 'attraction',
        rating: 4.9,
        reviews: 5000,
        distance: 10,
        isOpen: true,
        ...findImage('state-kerala-place-backwaters'),
      },
      {
        name: 'Eravikulam National Park',
        description: 'Home to the endangered Nilgiri Tahr, this park is known for its stunning grasslands.',
        category: 'attraction',
        rating: 4.7,
        reviews: 1500,
        distance: 15,
        isOpen: true,
        ...findImage('state-kerala-place-eravikulam'),
      },
      {
        name: 'Varkala Beach',
        description: 'Famous for its cliff-side setting, offering dramatic views of the Arabian Sea.',
        category: 'attraction',
        rating: 4.6,
        reviews: 2200,
        distance: 50,
        isOpen: true,
        ...findImage('state-kerala-place-varkala'),
      },
    ],
    galleryImages: [
        { url: findImage('state-kerala-gallery-1').imageUrl, hint: findImage('state-kerala-gallery-1').imageHint },
        { url: findImage('state-kerala-gallery-2').imageUrl, hint: findImage('state-kerala-gallery-2').imageHint },
        { url: findImage('state-kerala-gallery-3').imageUrl, hint: findImage('state-kerala-gallery-3').imageHint },
    ],
    travelInfo: {
      bestTimeToVisit: 'September to March, for pleasant weather ideal for exploring.',
      localFood: 'Appam and Stew, Puttu and Kadala Curry, Sadya (a grand feast), and fresh seafood.',
      cultureAndFestivals: 'Onam, a harvest festival with floral decorations and boat races (Vallam Kali), and Theyyam, a vibrant ritual dance.',
    },
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    tagline: 'The Land of Mystic Splendor.',
    bannerImageUrl: findImage('state-sikkim-banner').imageUrl,
    bannerImageHint: findImage('state-sikkim-banner').imageHint,
    about: [
        'Sikkim is a state in northeast India, bordered by Bhutan, Tibet and Nepal. Part of the Himalayas, the area has a dramatic landscape that includes India’s highest mountain, 8,586m Kangchenjunga.',
        'Sikkim is also home to glaciers, alpine meadows and thousands of varieties of wildflowers. Steep paths lead to hilltop Buddhist monasteries such as Pemayangtse, which dates to the early 1700s.'
    ],
    cities: [
      {
        name: 'Gangtok',
        description: 'The capital city, offering stunning views of Mt. Kanchenjunga.',
        ...findImage('state-sikkim-city-gangtok'),
      },
    ],
    famousPlaces: [
      {
        name: 'Tsomgo Lake',
        description: 'A glacial lake in the East Sikkim district, some 40 kilometres from the capital Gangtok.',
        category: 'attraction',
        rating: 4.7,
        reviews: 1200,
        distance: 40,
        isOpen: true,
        ...findImage('state-sikkim-place-tsomgo'),
      },
      {
        name: 'MG Marg, Gangtok',
        description: 'A bustling, vehicle-free boulevard in the heart of Gangtok, perfect for a stroll.',
        category: 'market',
        rating: 4.5,
        reviews: 2500,
        distance: 2,
        isOpen: true,
        ...findImage('state-sikkim-place-mgmarg'),
      },
      {
        name: 'Rumtek Monastery',
        description: 'A magnificent Tibetan Buddhist monastery, one of the most important in Sikkim.',
        category: 'attraction',
        rating: 4.9,
        reviews: 1800,
        distance: 23,
        isOpen: true,
        ...findImage('state-sikkim-place-rumtek'),
      },
      {
        name: 'The Coffee Shop',
        description: 'A cozy cafe in Gangtok known for its great coffee and views.',
        category: 'cafe',
        rating: 4.6,
        reviews: 350,
        distance: 1.5,
        isOpen: true,
        ...findImage('state-sikkim-place-coffeeshop'),
      },
      {
        name: 'Taste of Tibet',
        description: 'Authentic Tibetan cuisine, famous for its momos and thukpa.',
        category: 'restaurant',
        rating: 4.4,
        reviews: 500,
        distance: 1.8,
        isOpen: true,
        ...findImage('state-sikkim-place-tibetfood'),
      },
      {
        name: 'Nathula Pass',
        description: 'A mountain pass on the Dongkya Range of the Himalayas between China\'s Yadong County and Sikkim.',
        category: 'attraction',
        rating: 4.8,
        reviews: 900,
        distance: 56,
        isOpen: false,
        ...findImage('state-sikkim-place-nathula')
      }
    ],
    galleryImages: [
        { url: findImage('state-sikkim-gallery-1').imageUrl, hint: findImage('state-sikkim-gallery-1').imageHint },
        { url: findImage('state-sikkim-gallery-2').imageUrl, hint: findImage('state-sikkim-gallery-2').imageHint },
        { url: findImage('state-sikkim-gallery-3').imageUrl, hint: findImage('state-sikkim-gallery-3').imageHint },
    ],
    travelInfo: {
      bestTimeToVisit: 'March to May and October to mid-December.',
      localFood: 'Momos, Thukpa, Phagshapa, and Gundruk.',
      cultureAndFestivals: 'Saga Dawa, Losar Festival, and the International Flower Festival.',
    },
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    tagline: 'Abode of the Himalayas, land of serene beauty and thrilling adventures.',
    bannerImageUrl: findImage('state-himachal-banner').imageUrl,
    bannerImageHint: findImage('state-himachal-banner').imageHint,
    about: [
        'Himachal Pradesh is a northern Indian state in the Himalayas. It\'s home to scenic mountain towns and resorts such as Dalhousie. Host to the Dalai Lama, Himachal Pradesh has a strong Tibetan presence. This is reflected in its Buddhist temples and monasteries, as well as its vibrant Tibetan New Year celebrations.',
        'The state is also well known for its trekking, climbing, and skiing areas. From the lush valleys of Kullu and Kangra to the barren landscapes of Lahaul and Spiti, Himachal offers an incredibly diverse range of natural beauty.'
    ],
    cities: [
      {
        name: 'Shimla',
        description: 'The capital city, known for its colonial architecture and the bustling Mall Road.',
        ...findImage('state-himachal-city-shimla'),
      },
      {
        name: 'Manali',
        description: 'A high-altitude resort town famous for its adventure sports and as a gateway to Solang Valley.',
        ...findImage('state-himachal-city-manali'),
      },
      {
        name: 'Dharamshala',
        description: 'Home to the Dalai Lama and the Tibetan government-in-exile, with a vibrant Tibetan culture.',
        ...findImage('state-himachal-city-dharamshala'),
      },
    ],
    famousPlaces: [
      {
        name: 'Rohtang Pass',
        description: 'A high mountain pass connecting the Kullu Valley with the Lahaul and Spiti Valleys.',
        category: 'attraction',
        rating: 4.7,
        reviews: 2000,
        distance: 51,
        isOpen: false,
        ...findImage('state-himachal-place-rohtang'),
      },
      {
        name: 'Solang Valley',
        description: 'A popular destination for summer and winter sports, including paragliding, zorbing, and skiing.',
        category: 'attraction',
        rating: 4.6,
        reviews: 3000,
        distance: 14,
        isOpen: true,
        ...findImage('state-himachal-place-solang'),
      },
      {
        name: 'Parvati Valley',
        description: 'A stunning valley leading to Kasol and several famous trekking routes.',
        category: 'attraction',
        rating: 4.8,
        reviews: 2500,
        distance: 80,
        isOpen: true,
        ...findImage('state-himachal-place-parvati'),
      },
    ],
    galleryImages: [
      { url: findImage('state-himachal-gallery-1').imageUrl, hint: findImage('state-himachal-gallery-1').imageHint },
      { url: findImage('state-himachal-gallery-2').imageUrl, hint: findImage('state-himachal-gallery-2').imageHint },
      { url: findImage('state-himachal-gallery-3').imageUrl, hint: findImage('state-himachal-gallery-3').imageHint },
    ],
    travelInfo: {
      bestTimeToVisit: 'April to June for pleasant weather, and October to February for snow.',
      localFood: 'Dham, Siddu, Babru, and various lentil and meat preparations.',
      cultureAndFestivals: 'Kullu Dussehra, Losar (Tibetan New Year), and various local fairs.',
    },
  },
  {
    id: 'goa',
    name: 'Goa',
    tagline: 'The Pearl of the Orient, a paradise of sun, sand, and sea.',
    bannerImageUrl: findImage('state-goa-banner').imageUrl,
    bannerImageHint: findImage('state-goa-banner').imageHint,
    about: [
        'Goa is a state in western India with coastlines stretching along the Arabian Sea. Its long history as a Portuguese colony prior to 1961 is evident in its preserved 17th-century churches and the area’s tropical spice plantations.',
        'Goa is also known for its beaches, ranging from popular stretches at Baga and Palolem to those in laid-back fishing villages such as Agonda. The state is famous for its vibrant nightlife, seafood, and relaxed atmosphere.'
    ],
    cities: [
      {
        name: 'Panjim',
        description: 'The state capital, known for its colonial-era buildings and the beautiful Mandovi River.',
        ...findImage('state-goa-city-panjim'),
      },
      {
        name: 'Margao',
        description: 'The commercial capital of Goa, with bustling markets and historic Portuguese architecture.',
        ...findImage('state-goa-city-margao'),
      },
      {
        name: 'Vasco da Gama',
        description: 'A major port city with a mix of industrial and cultural sights.',
        ...findImage('state-goa-city-vasco'),
      },
    ],
    famousPlaces: [
      {
        name: 'Baga Beach',
        description: 'One of the most famous beaches in North Goa, known for its nightlife and water sports.',
        category: 'attraction',
        rating: 4.5,
        reviews: 5000,
        distance: 10,
        isOpen: true,
        ...findImage('state-goa-place-baga'),
      },
      {
        name: 'Dudhsagar Falls',
        description: 'A magnificent four-tiered waterfall located on the Mandovi River.',
        category: 'attraction',
        rating: 4.8,
        reviews: 1800,
        distance: 60,
        isOpen: true,
        ...findImage('state-goa-place-dudhsagar'),
      },
      {
        name: 'Fort Aguada',
        description: 'A well-preserved 17th-century Portuguese fort with a lighthouse overlooking the sea.',
        category: 'attraction',
        rating: 4.6,
        reviews: 3500,
        distance: 15,
        isOpen: true,
        ...findImage('state-goa-place-aguada'),
      },
    ],
    galleryImages: [
      { url: findImage('state-goa-gallery-1').imageUrl, hint: findImage('state-goa-gallery-1').imageHint },
      { url: findImage('state-goa-gallery-2').imageUrl, hint: findImage('state-goa-gallery-2').imageHint },
      { url: findImage('state-goa-gallery-3').imageUrl, hint: findImage('state-goa-gallery-3').imageHint },
    ],
    travelInfo: {
      bestTimeToVisit: 'November to February, when the weather is cool and pleasant.',
      localFood: 'Goan fish curry, Vindaloo, Bebinca, and fresh seafood.',
      cultureAndFestivals: 'Goa Carnival, Sunburn Festival, and the Feast of St. Francis Xavier.',
    },
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    tagline: 'The Land of the Gods, a place of mountains, myths, and meditation.',
    bannerImageUrl: findImage('state-uttarakhand-banner').imageUrl,
    bannerImageHint: findImage('state-uttarakhand-banner').imageHint,
    about: [
        'Uttarakhand, a state in northern India crossed by the Himalayas, is known for its Hindu pilgrimage sites. Rishikesh, a major centre for yoga study, was made famous by the Beatles’ 1968 visit.',
        'The state\'s forested Corbett National Park shelters Bengal tigers and other native wildlife. Uttarakhand is also known for its stunning natural beauty, from the snow-capped peaks of Nanda Devi to the serene lakes of Nainital.'
    ],
    cities: [
      {
        name: 'Dehradun',
        description: 'The state capital, nestled in the Doon Valley, with a pleasant climate and scenic surroundings.',
        ...findImage('state-uttarakhand-city-dehradun'),
      },
      {
        name: 'Nainital',
        description: 'A popular hill station built around a pear-shaped lake, surrounded by mountains.',
        ...findImage('state-uttarakhand-city-nainital'),
      },
      {
        name: 'Rishikesh',
        description: 'Known as the Yoga Capital of the World, situated on the banks of the sacred Ganges River.',
        ...findImage('state-uttarakhand-city-rishikesh'),
      },
    ],
    famousPlaces: [
      {
        name: 'Valley of Flowers',
        description: 'A national park known for its meadows of endemic alpine flowers and stunning landscapes.',
        category: 'attraction',
        rating: 4.9,
        reviews: 1200,
        distance: 300,
        isOpen: false,
        ...findImage('state-uttarakhand-place-valleyflowers'),
      },
      {
        name: 'Jim Corbett National Park',
        description: 'India\'s oldest national park, famous for its Bengal tiger population.',
        category: 'attraction',
        rating: 4.7,
        reviews: 2500,
        distance: 60,
        isOpen: true,
        ...findImage('state-uttarakhand-place-jimcorbett'),
      },
      {
        name: 'Lakshman Jhula',
        description: 'A famous suspension bridge across the Ganges in Rishikesh, with temples and markets nearby.',
        category: 'attraction',
        rating: 4.5,
        reviews: 4000,
        distance: 5,
        isOpen: true,
        ...findImage('state-uttarakhand-place-lakshmanjhula'),
      },
    ],
    galleryImages: [
      { url: findImage('state-uttarakhand-gallery-1').imageUrl, hint: findImage('state-uttarakhand-gallery-1').imageHint },
      { url: findImage('state-uttarakhand-gallery-2').imageUrl, hint: findImage('state-uttarakhand-gallery-2').imageHint },
      { url: findImage('state-uttarakhand-gallery-3').imageUrl, hint: findImage('state-uttarakhand-gallery-3').imageHint },
    ],
    travelInfo: {
      bestTimeToVisit: 'March to April and September to October are ideal for pleasant weather.',
      localFood: 'Aloo ke Gutke, Kafuli, Phaanu, and Bal Mithai.',
      cultureAndFestivals: 'Kumbh Mela in Haridwar, Nanda Devi Raj Jat Yatra, and the International Yoga Festival.',
    },
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    tagline: 'The Land of High Passes, a realm of dramatic landscapes and spiritual serenity.',
    bannerImageUrl: findImage('state-ladakh-banner').imageUrl,
    bannerImageHint: findImage('state-ladakh-banner').imageHint,
    about: [
        'Ladakh is a region administered by India as a union territory, and constitutes a part of the larger Kashmir region. It is a land of high-altitude deserts, rugged mountains, and ancient Buddhist monasteries.',
        'Known for its breathtaking landscapes, crystal-clear lakes, and a culture heavily influenced by Tibetan Buddhism, Ladakh offers a unique and unforgettable travel experience. It is a popular destination for trekking, motorbiking, and spiritual retreats.'
    ],
    cities: [
      {
        name: 'Leh',
        description: 'The joint capital and largest town of Ladakh, situated in a valley at an altitude of 3,500 meters.',
        ...findImage('state-ladakh-city-leh'),
      },
      {
        name: 'Kargil',
        description: 'The second largest town, known for its historical significance and as a gateway to the Suru Valley.',
        ...findImage('state-ladakh-city-kargil'),
      },
    ],
    famousPlaces: [
      {
        name: 'Pangong Tso',
        description: 'A stunning high-altitude lake that changes colors throughout the day, located on the border with Tibet.',
        category: 'attraction',
        rating: 4.9,
        reviews: 3000,
        distance: 220,
        isOpen: true,
        ...findImage('state-ladakh-place-pangong'),
      },
      {
        name: 'Nubra Valley',
        description: 'A high-altitude desert valley known for its sand dunes and double-humped Bactrian camels.',
        category: 'attraction',
        rating: 4.8,
        reviews: 2500,
        distance: 160,
        isOpen: true,
        ...findImage('state-ladakh-place-nubra'),
      },
      {
        name: 'Thiksey Monastery',
        description: 'A magnificent Tibetan Buddhist monastery resembling the Potala Palace in Lhasa, Tibet.',
        category: 'attraction',
        rating: 4.8,
        reviews: 1800,
        distance: 19,
        isOpen: true,
        ...findImage('state-ladakh-place-thiksey'),
      },
    ],
    galleryImages: [
      { url: findImage('state-ladakh-gallery-1').imageUrl, hint: findImage('state-ladakh-gallery-1').imageHint },
      { url: findImage('state-ladakh-gallery-2').imageUrl, hint: findImage('state-ladakh-gallery-2').imageHint },
      { url: findImage('state-ladakh-gallery-3').imageUrl, hint: findImage('state-ladakh-gallery-3').imageHint },
    ],
    travelInfo: {
      bestTimeToVisit: 'June to September, when the roads are open and the weather is most favorable.',
      localFood: 'Thukpa, Momos, Skyu, and Butter Tea.',
      cultureAndFestivals: 'Hemis Festival, Losar Festival, and Dosmochey.',
    },
  }
];

export const allIndianStatesAndUTs = [
  { id: "andaman-and-nicobar-islands", name: "Andaman & Nicobar" },
  { id: "andhra-pradesh", name: "Andhra Pradesh" },
  { id: "arunachal-pradesh", name: "Arunachal Pradesh" },
  { id: "assam", name: "Assam" },
  { id: "bihar", name: "Bihar" },
  { id: "chandigarh", name: "Chandigarh" },
  { id: "chhattisgarh", name: "Chhattisgarh" },
  { id: "dadra-and-nagar-haveli-and-daman-and-diu", name: "Daman & Diu" },
  { id: "delhi", name: "Delhi" },
  { id: "goa", name: "Goa" },
  { id: "gujarat", name: "Gujarat" },
  { id: "haryana", name: "Haryana" },
  { id: "himachal-pradesh", name: "Himachal Pradesh" },
  { id: "jammu-and-kashmir", name: "Jammu & Kashmir" },
  { id: "jharkhand", name: "Jharkhand" },
  { id: "karnataka", name: "Karnataka" },
  { id: "kerala", name: "Kerala" },
  { id: "ladakh", name: "Ladakh" },
  { id: "lakshadweep", name: "Lakshadweep" },
  { id: "madhya-pradesh", name: "Madhya Pradesh" },
  { id: "maharashtra", name: "Maharashtra" },
  { id: "manipur", name: "Manipur" },
  { id: "meghalaya", name: "Meghalaya" },
  { id: "mizoram", name: "Mizoram" },
  { id: "nagaland", name: "Nagaland" },
  { id: "odisha", name: "Odisha" },
  { id: "puducherry", name: "Puducherry" },
  { id: "punjab", name: "Punjab" },
  { id: "rajasthan", name: "Rajasthan" },
  { id: "sikkim", name: "Sikkim" },
  { id: "tamil-nadu", name: "Tamil Nadu" },
  { id: "telangana", name: "Telangana" },
  { id: "tripura", name: "Tripura" },
  { id: "uttar-pradesh", name: "Uttar Pradesh" },
  { id: "uttarakhand", name: "Uttarakhand" },
  { id: "west-bengal", name: "West Bengal" },
];
