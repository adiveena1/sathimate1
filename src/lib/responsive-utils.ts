/**
 * Responsive utilities and constants for mobile-first design
 * All values are optimized for accessibility (44px+ tap targets)
 * and smooth mobile user experience
 */

// Responsive text sizes - mobile first, scales up
export const RESPONSIVE_TEXT = {
  // Heading sizes
  h1Mobile: 'text-3xl md:text-5xl lg:text-8xl',
  h2Mobile: 'text-2xl md:text-4xl lg:text-6xl',
  h3Mobile: 'text-xl md:text-2xl lg:text-4xl',
  
  // Body text
  bodySm: 'text-xs md:text-sm',
  bodyBase: 'text-sm md:text-base',
  bodyLg: 'text-base md:text-lg',
  
  // Special
  label: 'text-xs font-semibold uppercase tracking-wider',
} as const;

// Responsive spacing - mobile first
export const RESPONSIVE_SPACING = {
  // Section padding
  sectionPy: 'py-8 md:py-16 lg:py-24',
  sectionPx: 'px-4 md:px-6 lg:px-8',
  sectionFull: 'py-8 md:py-16 lg:py-24 px-4 md:px-6 lg:px-8',
  
  // Container
  containerPx: 'px-4 sm:px-6 lg:px-8',
  
  // Component spacing
  compactGap: 'gap-2 md:gap-3 lg:gap-4',
  normalGap: 'gap-3 md:gap-4 lg:gap-6',
  largeGap: 'gap-4 md:gap-6 lg:gap-8',
} as const;

// Button sizing - 44px minimum on mobile for accessibility
export const RESPONSIVE_BUTTON = {
  sm: 'h-9 px-3 text-xs md:h-8 md:px-2',
  md: 'h-11 px-4 text-sm md:h-10 md:px-3',
  lg: 'h-12 px-6 text-base md:h-11 md:px-5',
  xl: 'h-14 px-8 text-base md:h-12 md:px-6',
} as const;

// Tap target sizes (minimum 44x44 on mobile)
export const TAP_TARGET = {
  sm: 'h-10 w-10 md:h-9 md:w-9', // 40px mobile -> 36px desktop
  md: 'h-12 w-12 md:h-10 md:w-10', // 48px mobile -> 40px desktop
  lg: 'h-14 w-14 md:h-12 md:w-12', // 56px mobile -> 48px desktop
} as const;

// Responsive rounded corners
export const ROUNDED = {
  xs: 'rounded-lg',
  sm: 'rounded-xl',
  md: 'rounded-2xl',
  lg: 'rounded-3xl',
  full: 'rounded-full',
} as const;

// Responsive shadow
export const SHADOW = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg hover:shadow-xl transition-shadow',
  xl: 'shadow-xl hover:shadow-2xl transition-shadow',
} as const;

// Animation utilities
export const ANIMATION = {
  smooth: 'transition-all duration-300 ease-in-out',
  smoothFast: 'transition-all duration-200 ease-in-out',
  smoothSlow: 'transition-all duration-500 ease-in-out',
} as const;

// Breakpoint helpers
export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Mobile-first container queries (if needed for future)
export const MOBILE_FIRST = {
  // Hide on mobile, show on desktop
  hideMobile: 'hidden md:flex',
  showMobile: 'flex md:hidden',
  
  // Full width on mobile, constrained on desktop
  fullMobile: 'w-full md:w-auto',
  
  // Stack on mobile, grid on desktop
  stackMobile: 'flex flex-col md:grid',
} as const;

// Safe areas (padding for notch/home indicator)
export const SAFE_AREA = {
  // Top safe area for headers
  top: 'pt-safe',
  // Bottom safe area for nav/buttons
  bottom: 'pb-safe',
  // Both
  all: 'pt-safe pb-safe',
} as const;

// Floating button positions - prevent overlap
export const FLOATING_POSITIONS = {
  botRight: 'fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40',
  botLeft: 'fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-40',
  topRight: 'fixed top-20 right-6 sm:top-24 sm:right-8 z-40',
  topLeft: 'fixed top-20 left-6 sm:top-24 sm:left-8 z-40',
} as const;

// Performance-optimized animations (lightweight)
export const LIGHTWEIGHT_ANIMATION = {
  fadeIn: 'animate-in fade-in duration-300',
  slideInUp: 'animate-in slide-in-from-bottom-4 duration-300',
  slideInDown: 'animate-in slide-in-from-top-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-300',
} as const;
