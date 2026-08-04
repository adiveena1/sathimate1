
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Compass, Calendar, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { popularDestinations } from '@/lib/india-data';

export function GlobalSearch({ variant = 'header' }: { variant?: 'header' | 'hero' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/sathi-space?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  const filteredDestinations = popularDestinations.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.state.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

    if (variant === 'hero') {
    return (
      <div className="relative w-full max-w-2xl mx-auto mt-4 md:mt-8 px-2 md:px-4" ref={containerRef}>
        <form onSubmit={handleSearch} className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:bg-white/15 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary h-11 md:h-16">
          <Search className="absolute left-4 md:left-6 h-5 md:h-6 w-5 md:w-6 text-white/70 flex-shrink-0" />
          <input 
            type="text"
            placeholder="Find travelers heading to your destination..."
            className="w-full h-full bg-transparent pl-12 md:pl-16 pr-12 md:pr-32 outline-none text-white focus:text-black placeholder:text-white/60 focus:placeholder:text-gray-400 text-sm md:text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          <Button 
            type="submit" 
            className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 h-9 md:h-12 px-4 md:px-6 rounded-lg md:rounded-xl hidden sm:flex text-xs md:text-base"
          >
            Search
          </Button>
        </form>

        {/* Hero Suggestions */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-4 right-4 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 text-card-foreground"
            >
              <div className="p-4 border-b border-border bg-muted/30">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Popular Destinations</span>
              </div>
              <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map(dest => (
                    <button
                      key={dest.id + dest.name}
                      autoFocus={false}
                      onClick={() => {
                        setQuery(dest.name);
                        router.push(`/state/${dest.id}`);
                        setIsFocused(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-left group"
                    >
                      <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors text-primary shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{dest.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{dest.state}</p>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shrink-0" />
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="bg-muted/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">No destinations found for "{query}"</p>
                    <p className="text-xs text-muted-foreground mt-1">Try searching for a state or a different city.</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center">
                 <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => setQuery('Goa')}>Goa</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => setQuery('Manali')}>Manali</Badge>
                 </div>
                 <Button variant="ghost" size="sm" onClick={() => router.push('/sathi-space')}>Explore All <Compass className="ml-2 h-4 w-4" /></Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Header Variant
  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full right-0 mt-4 w-[min(90vw,350px)] md:w-[450px] bg-card text-card-foreground border border-border rounded-2xl shadow-2xl overflow-hidden z-50 p-4"
          >
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Where do you want to go?"
                  className="pl-9 h-10 rounded-xl"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={() => handleSearch()} size="sm" className="rounded-xl">Find</Button>
            </div>

            <div className="space-y-4">
               <div>
                 <span className="text-xs sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Suggestions</span>
                 <div className="mt-2 space-y-1 max-h-[300px] overflow-y-auto pr-1">
                   {(query ? filteredDestinations : popularDestinations.slice(0, 6)).map(dest => (
                     <button
                       key={dest.id + dest.name}
                       onClick={() => {
                         router.push(`/state/${dest.id}`);
                         setIsOpen(false);
                       }}
                       className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors text-left group"
                     >
                       <div className="bg-primary/5 p-1.5 rounded-lg group-hover:bg-primary/10 transition-colors">
                         <MapPin className="h-4 w-4 text-primary" />
                       </div>
                       <div className="min-w-0">
                         <p className="text-sm font-semibold truncate">{dest.name}</p>
                         <p className="text-xs sm:text-[10px] text-muted-foreground truncate">{dest.state}</p>
                       </div>
                       <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                     </button>
                   ))}
                   {filteredDestinations.length === 0 && query && (
                     <div className="p-4 text-center text-xs text-muted-foreground">
                       No results found
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
