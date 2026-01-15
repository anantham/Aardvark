'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Star, Eye, Clock, Crown } from 'lucide-react';
import { cn, formatCompactNumber, getCategoryColorClass } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Story } from '@aardvark/shared';

interface StoryCardProps {
  story: Story;
  featured?: boolean;
  horizontal?: boolean;
}

/**
 * Story card component for displaying story previews.
 * Supports vertical (grid) and horizontal (list) layouts.
 */
export function StoryCard({ story, featured = false, horizontal = false }: StoryCardProps) {
  const categoryLabel = story.category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  if (horizontal) {
    return (
      <Link
        href={`/story/${story.id}`}
        className="group flex gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
      >
        {/* Cover image */}
        <div className="relative h-32 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          {story.coverImageUrl ? (
            <Image
              src={story.coverImageUrl}
              alt={story.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {story.isPremium && (
            <div className="absolute top-1 right-1 p-1 bg-amber-500 rounded">
              <Crown className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {story.title}
            </h3>
            <Badge
              variant="secondary"
              className={cn('text-xs flex-shrink-0', getCategoryColorClass(story.category))}
            >
              {categoryLabel}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {story.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              {story.averageRating?.toFixed(1) || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatCompactNumber(story.viewCount || 0)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {story.estimatedReadTime || '?'} min
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/story/${story.id}`}
      className={cn(
        'group flex flex-col rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1',
        featured && 'ring-2 ring-primary/50'
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-[2/3] bg-muted">
        {story.coverImageUrl ? (
          <Image
            src={story.coverImageUrl}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted-foreground/10">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Premium badge */}
        {story.isPremium && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-amber-500 rounded-full text-white text-xs font-medium">
            <Crown className="h-3 w-3" />
            {story.creditCost} credits
          </div>
        )}

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary rounded-full text-primary-foreground text-xs font-medium">
            Featured
          </div>
        )}

        {/* Category badge */}
        <div className="absolute bottom-2 left-2">
          <Badge
            variant="secondary"
            className={cn('text-xs backdrop-blur-sm', getCategoryColorClass(story.category))}
          >
            {categoryLabel}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {story.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-3">
          {story.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              {story.averageRating?.toFixed(1) || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatCompactNumber(story.viewCount || 0)}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {story.estimatedReadTime || '?'} min
          </span>
        </div>
      </div>
    </Link>
  );
}
