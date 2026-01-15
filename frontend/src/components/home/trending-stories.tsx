'use client';

import { useQuery } from '@tanstack/react-query';
import { StoryCard } from '@/components/story/story-card';
import { StorySkeleton } from '@/components/ui/skeleton';
import type { Story } from '@aardvark/shared';

/**
 * Fetch trending stories from the API
 */
async function fetchTrendingStories(): Promise<Story[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/stories?sort=trending&limit=6`
  );
  if (!response.ok) throw new Error('Failed to fetch trending stories');
  const { data } = await response.json();
  return data.items;
}

/**
 * Trending stories section showing most popular stories this week.
 */
export function TrendingStories() {
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['stories', 'trending'],
    queryFn: fetchTrendingStories,
  });

  if (isLoading) {
    return <StorySkeleton count={6} />;
  }

  if (error || !stories?.length) {
    // Return placeholder stories for demo
    const demoCategories = ['fantasy', 'sci_fi', 'romance', 'mystery', 'thriller', 'adventure'];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoCategories.map((category, i) => (
          <StoryCard
            key={i}
            story={{
              id: `trending-${i}`,
              title: `Trending ${category.replace('_', ' ')} Story`,
              description: 'A captivating tale that has captured readers attention...',
              coverImageUrl: null,
              category: category as Story['category'],
              averageRating: 4.2 + i * 0.1,
              viewCount: 5000 - i * 500,
              authorId: 'demo-author',
              estimatedReadTime: 15 + i * 5,
            } as Story}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}
