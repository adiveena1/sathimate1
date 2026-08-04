/**
 * Sathimate i18n
 *
 * English default hai. Hinglish (Roman script) opt-in — jisko chahiye wo header
 * se switch kar lega. English values hi asli source of truth hain.
 *
 * Hinglish jaan-boojh kar Roman script mein hai, Devanagari mein nahi.
 * Target users (18-30, Delhi NCR / metros) Roman-script Hinglish tez padhte
 * hain. Devanagari baad mein teesri locale ke roop mein add ho sakti hai —
 * bas LOCALES array aur ek naya block chahiye, aur kuch nahi.
 *
 * Jaan-boojh kar next-intl / [locale] routing nahi use kiya:
 * uske liye har route ko /en/... /hi/... mein move karna padta, middleware
 * badalna padta, aur Capacitor wrapper ke deep links tootne ka risk hai.
 * Launch se pehle wo change bada hai. Ye context-based approach chhota hai
 * aur baad mein next-intl par shift karna aasan rahega — dictionary
 * structure wahi rehta hai.
 *
 * NAYI STRING ADD KARNI HO:
 *   1. `en` mein key daalo
 *   2. `hi` mein wahi key daalo
 *   3. component mein `const t = useT()` phir `t('your.key')`
 * `hi` mein key missing ho to English fallback ho jata hai — app tootegi nahi.
 */

export const LOCALES = ['en', 'hinglish'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  hinglish: 'Hinglish',
};

/**
 * <html lang> ke liye. Roman script wali Hindi ka sahi BCP-47 tag 'hi-Latn'
 * hai — sirf 'hi' likhne se screen readers Devanagari maan kar galat padhte
 * hain.
 */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: 'en',
  hinglish: 'hi-Latn',
};

export const dictionary = {
  en: {
    /* ---- common ---- */
    'common.language': 'Language',

    /* ---- hero ---- */
    'hero.badge': 'Meet Before You Move',
    'hero.title.line1': "Don't travel with",
    'hero.title.line2': 'strangers.',
    'hero.subtitle':
      'Talk first. Make the plan. Agree on the budget. Then go — with people you already know.',
    'hero.description':
      'Sathimate is not a booking site. You do not buy tickets here, you find travel companions. Whether it is Manali or Rishikesh, the group knows each other weeks before departure.',
    'hero.point1.stat': 'Groups first',
    'hero.point1.desc': 'Choose your companions before the trip, not during it',
    'hero.point2.stat': 'No cold DMs',
    'hero.point2.desc': 'Conversations happen inside the group, in the open',
    'hero.point3.stat': 'Free to join',
    'hero.point3.desc': 'No booking commission. We are not an agent',

    /* ---- discovery ---- */
    'discovery.label': 'Find',
    'discovery.title': 'Meet first. Then travel.',
    'discovery.body':
      'See who else is heading to the same place on the same dates. Shortlist by budget and travel style.',
    'discovery.f1.title': 'Filter and search',
    'discovery.f1.desc': 'By destination, dates, budget and travel style',
    'discovery.f2.title': 'Full profiles',
    'discovery.f2.desc': 'Travel style, budget and bio — all visible upfront',
    'discovery.f3.title': 'Safe and transparent',
    'discovery.f3.desc': 'See detailed travel preferences and interests',
    'discovery.cta': 'Discover travel partners',

    /* ---- planning ---- */
    'planning.label': 'Plan',
    'planning.title': 'Groups by destination',
    'planning.body':
      'Browse existing travel groups or create your own. Share itineraries, discuss budgets, and settle the details before departure.',
    'planning.f1.title': 'Group chat',
    'planning.f1.desc': 'Real-time conversation with everyone going',
    'planning.f2.title': 'Shared itinerary',
    'planning.f2.desc': 'Plan the trip together, with checklists',
    'planning.f3.title': 'Budget tracking',
    'planning.f3.desc': 'Split costs easily among group members',
    'planning.cta': 'Explore groups',

    /* ---- exploration ---- */
    'exploration.label': 'Go',
    'exploration.title': 'Who is travelling nearby',
    'exploration.body':
      'Find travellers around you right now. Spontaneous meetups, local exploring, and last-minute plans.',
    'exploration.f1.title': 'Location-based discovery',
    'exploration.f1.desc': 'Find travellers in your city instantly',
    'exploration.f2.title': 'Last-minute plans',
    'exploration.f2.desc': 'Sort out a trip on short notice',
    'exploration.f3.title': 'Local insight',
    'exploration.f3.desc': 'Tips from locals and experienced travellers',
    'exploration.cta': 'Find nearby travellers',

    /* ---- how it works ---- */
    'how.title': 'How it works',
    'how.subtitle': 'Three steps. The first one starts two weeks before the trip.',

    /* ---- values ---- */
    'values.title': 'Three rules here',
    'values.subtitle': 'If any of these break, report it. We act.',
    'values.trust.title': 'Trust',
    'values.trust.desc':
      'Conversations happen inside the group, in the open. No private DMs until both sides agree.',
    'values.clarity.title': 'Clarity',
    'values.clarity.desc':
      'Before you leave you will know who is coming, what it costs, and where you are staying.',
    'values.respect.title': 'Respect',
    'values.respect.desc':
      'Harassment does not get a warning. The account is closed.',

    /* ---- founder note ---- */
    'founder.label': 'Where we are',
    'founder.role': 'Building Sathimate, from Greater Noida',

    /* ---- preview panels ---- */
    'preview.sample': 'Sample view',
    'preview.location.note': 'Location is shared only when you turn it on',
    'preview.nearby.title': 'Nearby right now',
    'preview.live': 'Live',
    'preview.perhead': 'Per head',
    'preview.open': 'Open',
  },

  hinglish: {
    'common.language': 'Bhasha',

    'hero.badge': 'Meet Before You Move',
    'hero.title.line1': 'Ajnabiyon ke saath',
    'hero.title.line2': 'travel mat karo.',
    'hero.subtitle':
      'Pehle baat karo. Plan banao. Kharcha tay karo. Phir nikalo — un logon ke saath jinhe tum pehle se jaante ho.',
    'hero.description':
      'Sathimate booking site nahi hai. Yahan ticket nahi khareedte, saathi dhoondhte hain. Manali ho ya Rishikesh — nikalne se hafton pehle poora group ek dusre ko jaan leta hai.',
    'hero.point1.stat': 'Pehle group',
    'hero.point1.desc': 'Saathi trip se pehle choose karo, beech mein nahi',
    'hero.point2.stat': 'Koi cold DM nahi',
    'hero.point2.desc': 'Baat group ke andar hoti hai, sabke saamne',
    'hero.point3.stat': 'Join karna free',
    'hero.point3.desc': 'Koi booking commission nahi. Hum agent nahi hain',

    'discovery.label': 'Dhoondho',
    'discovery.title': 'Pehle milo. Phir nikalo.',
    'discovery.body':
      'Usi jagah, usi date par aur kaun ja raha hai — dekho. Budget aur travel style se shortlist karo.',
    'discovery.f1.title': 'Filter karke dhoondo',
    'discovery.f1.desc': 'Destination, date, budget aur travel style se',
    'discovery.f2.title': 'Poori profile',
    'discovery.f2.desc': 'Travel style, budget aur bio — sab pehle se dikhta hai',
    'discovery.f3.title': 'Saaf aur safe',
    'discovery.f3.desc': 'Travel preferences aur interests detail mein dikhte hain',
    'discovery.cta': 'Travel partners dhoondho',

    'planning.label': 'Plan banao',
    'planning.title': 'Destination ke hisaab se group',
    'planning.body':
      'Bane hue groups dekho ya apna banao. Route, budget aur baaki details nikalne se pehle tay kar lo.',
    'planning.f1.title': 'Group chat',
    'planning.f1.desc': 'Jo log ja rahe hain, sabse seedhi baat',
    'planning.f2.title': 'Shared itinerary',
    'planning.f2.desc': 'Checklist ke saath milkar trip plan karo',
    'planning.f3.title': 'Budget tracking',
    'planning.f3.desc': 'Kharcha aapas mein aasani se bat jata hai',
    'planning.cta': 'Groups dekho',

    'exploration.label': 'Nikal pado',
    'exploration.title': 'Aas-paas kaun ja raha hai',
    'exploration.body':
      'Abhi tumhare aas-paas kaun ghoom raha hai, dekho. Achanak bane plans aur local ghumakkadi.',
    'exploration.f1.title': 'Aas-paas se khoj',
    'exploration.f1.desc': 'Apne sheher mein turant saathi dhoondho',
    'exploration.f2.title': 'Last-minute plans',
    'exploration.f2.desc': 'Kam time mein bhi trip ban jati hai',
    'exploration.f3.title': 'Local jaankari',
    'exploration.f3.desc': 'Local aur experienced travellers se tips',
    'exploration.cta': 'Aas-paas ke travellers dekho',

    'how.title': 'Kaam kaise karta hai',
    'how.subtitle': 'Teen kadam. Pehla trip se do hafte pehle.',

    'values.title': 'Yahan ke teen usool',
    'values.subtitle': 'Inme se koi toote to bata dena. Hum action lete hain.',
    'values.trust.title': 'Bharosa',
    'values.trust.desc':
      'Baat group ke andar hoti hai, sabke saamne. Private DM tab tak nahi jab tak dono taraf se haan na ho.',
    'values.clarity.title': 'Saaf-saaf',
    'values.clarity.desc':
      'Nikalne se pehle pata hoga kaun aa raha hai, kitna kharcha hai, aur kahan rukna hai.',
    'values.respect.title': 'Izzat',
    'values.respect.desc':
      'Harassment par warning nahi milti. Seedha account band.',

    'founder.label': 'Abhi tak',
    'founder.role': 'Sathimate bana raha hoon, Greater Noida se',

    'preview.sample': 'Sample view',
    'preview.location.note': 'Location tabhi dikhti hai jab tum on karo',
    'preview.nearby.title': 'Abhi aas-paas',
    'preview.live': 'Live',
    'preview.perhead': 'Per head',
    'preview.open': 'Open',
  },
} as const;

export type TranslationKey = keyof typeof dictionary.en;
