'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DiscoverFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  onSearch: (searchTerm: string) => void;
}

export function DiscoverFilters({ filters, setFilters, onSearch }: DiscoverFiltersProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Sort By</Label>
        <Select 
          value={filters.sortBy || 'newest'} 
          onValueChange={(val) => setFilters({ ...filters, sortBy: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest Members</SelectItem>
            <SelectItem value="most_active">Most Active</SelectItem>
            <SelectItem value="highest_score">Highest Travel Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Destination</Label>
        <Input 
          placeholder="Where are they going?" 
          value={filters.destination || ''}
          onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <Label>Budget Preference</Label>
        <Select 
          value={filters.budget || 'any'} 
          onValueChange={(val) => setFilters({ ...filters, budget: val === 'any' ? undefined : val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Budget</SelectItem>
            <SelectItem value="Economy">Economy</SelectItem>
            <SelectItem value="Mid-range">Mid-range</SelectItem>
            <SelectItem value="Luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Gender</Label>
        <Select 
          value={filters.gender || 'any'} 
          onValueChange={(val) => setFilters({ ...filters, gender: val === 'any' ? undefined : val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Gender</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="non-binary">Non-binary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full mt-4" onClick={() => setFilters({})}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search travelers by name, city, or interests..." 
            className="pl-9 h-12 bg-background border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-12 px-8">
          Search
        </Button>
        
        {/* Mobile Filter Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-12 w-12 lg:hidden shrink-0">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)] mt-4 pr-4">
              <FilterContent />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </form>

      {/* Desktop Filter Bar (Optional, if we want them horizontally instead of sidebar) */}
      <div className="hidden lg:flex items-center gap-4 p-4 bg-muted/30 border border-border/50 rounded-xl overflow-x-auto">
        <div className="flex items-center gap-2 font-medium text-sm shrink-0">
          <Filter className="h-4 w-4" />
          Quick Filters
        </div>
        <div className="h-6 w-px bg-border mx-2 shrink-0" />
        
        <Select value={filters.sortBy || 'newest'} onValueChange={(val) => setFilters({ ...filters, sortBy: val })}>
          <SelectTrigger className="w-[140px] h-9 bg-background">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="most_active">Most Active</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.budget || 'any'} onValueChange={(val) => setFilters({ ...filters, budget: val === 'any' ? undefined : val })}>
          <SelectTrigger className="w-[140px] h-9 bg-background">
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Budget</SelectItem>
            <SelectItem value="Economy">Economy</SelectItem>
            <SelectItem value="Mid-range">Mid-range</SelectItem>
            <SelectItem value="Luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.gender || 'any'} onValueChange={(val) => setFilters({ ...filters, gender: val === 'any' ? undefined : val })}>
          <SelectTrigger className="w-[140px] h-9 bg-background">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Gender</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        
        {Object.keys(filters).length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setFilters({})} className="ml-auto text-xs">
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
