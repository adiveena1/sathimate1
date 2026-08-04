'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StateCardProps {
  id: string;
  name: string;
  tagline: string; // Will be used for state name
  imageUrl: string;
  imageHint: string;
  badge?: string;
  communityText?: string;
}

export function StateCard({ id, name, tagline, imageUrl, imageHint, badge, communityText }: StateCardProps) {
  const badgeColors: { [key: string]: string } = {
    trending: 'bg-gradient-to-r from-blue-600 to-blue-800',
    adventure: 'bg-orange-500',
    spiritual: 'bg-purple-600',
    'solo friendly': 'bg-emerald-500',
    cultural: 'bg-pink-600',
  };
  
  const badgeColorClass = badge ? badgeColors[badge.toLowerCase()] || 'bg-slate-600' : 'bg-slate-600';

  return (
    <Link
      href={`/state/${id}`}
      className="group block rounded-2xl shadow-md hover:shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all duration-300 ease-in-out transform hover:scale-[1.03]"
      aria-label={`Learn more about ${name}`}
    >
      <div className="relative w-full h-96 overflow-hidden rounded-2xl">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint={imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.75)] to-[rgba(15,23,42,0.2)]" />
        
        {badge && (
          <Badge className={cn(
            "absolute top-4 right-4 border-none text-white text-xs rounded-full",
            "transition-all duration-300 group-hover:shadow-lg group-hover:shadow-black/30",
            badgeColorClass
          )}>
            {badge}
          </Badge>
        )}

        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
          <h2 className="text-3xl font-bold text-white">{name}</h2>
          <p className="text-sm font-light text-slate-200">{tagline}</p>
          {communityText && (
             <div className="mt-3 flex items-center gap-2 text-xs font-medium bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 w-fit text-slate-100">
                <Users className="h-4 w-4" />
                <span>{communityText}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
