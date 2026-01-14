'use client';

import Link from 'next/link';
import {
  Wand2,
  Rocket,
  Heart,
  Search,
  Zap,
  Skull,
  Compass,
  Scroll,
  Laugh,
  Theater,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Magic, mythical creatures, and epic quests',
    icon: Wand2,
    color: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-500',
  },
  {
    id: 'sci_fi',
    name: 'Sci-Fi',
    description: 'Space exploration and futuristic technology',
    icon: Rocket,
    color: 'from-cyan-500 to-blue-600',
    textColor: 'text-cyan-500',
  },
  {
    id: 'romance',
    name: 'Romance',
    description: 'Love stories and emotional journeys',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    textColor: 'text-pink-500',
  },
  {
    id: 'mystery',
    name: 'Mystery',
    description: 'Puzzles, clues, and detective work',
    icon: Search,
    color: 'from-indigo-500 to-blue-600',
    textColor: 'text-indigo-500',
  },
  {
    id: 'thriller',
    name: 'Thriller',
    description: 'Suspense, action, and edge-of-seat moments',
    icon: Zap,
    color: 'from-red-500 to-orange-600',
    textColor: 'text-red-500',
  },
  {
    id: 'horror',
    name: 'Horror',
    description: 'Fear, supernatural, and dark tales',
    icon: Skull,
    color: 'from-gray-600 to-gray-800',
    textColor: 'text-gray-500',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'Exploration, treasure, and daring feats',
    icon: Compass,
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-500',
  },
  {
    id: 'historical',
    name: 'Historical',
    description: 'Past eras, historical events, and period drama',
    icon: Scroll,
    color: 'from-stone-500 to-stone-700',
    textColor: 'text-stone-500',
  },
  {
    id: 'comedy',
    name: 'Comedy',
    description: 'Humor, wit, and lighthearted fun',
    icon: Laugh,
    color: 'from-green-500 to-emerald-600',
    textColor: 'text-green-500',
  },
  {
    id: 'drama',
    name: 'Drama',
    description: 'Emotional depth and character-driven stories',
    icon: Theater,
    color: 'from-purple-500 to-fuchsia-600',
    textColor: 'text-purple-500',
  },
];

/**
 * Category grid for browsing stories by genre.
 */
export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/stories?category=${category.id}`}
          className="group relative overflow-hidden rounded-xl p-4 bg-card border hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          {/* Gradient background on hover */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-200',
              category.color
            )}
          />

          <div className="relative">
            {/* Icon */}
            <div
              className={cn(
                'h-10 w-10 rounded-lg flex items-center justify-center mb-3 bg-muted group-hover:scale-110 transition-transform duration-200',
                category.textColor
              )}
            >
              <category.icon className="h-5 w-5" />
            </div>

            {/* Text */}
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
