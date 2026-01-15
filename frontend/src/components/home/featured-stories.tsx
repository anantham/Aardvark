'use client';

import { useQuery } from '@tanstack/react-query';
import { StoryCard } from '@/components/story/story-card';
import { StorySkeleton } from '@/components/ui/skeleton';
import type { Story } from '@aardvark/shared';

/**
 * Fetch featured stories from the API
 */
async function fetchFeaturedStories(): Promise<Story[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/stories?filter=featured&limit=4`
  );
  if (!response.ok) throw new Error('Failed to fetch featured stories');
  const { data } = await response.json();
  return data.items;
}

/**
 * Featured stories section showing editor's picks.
 */
export function FeaturedStories() {
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['stories', 'featured'],
    queryFn: fetchFeaturedStories,
  });

  if (isLoading) {
    return <StorySkeleton count={4} />;
  }

  if (error || !stories?.length) {
    // Return placeholder stories for demo
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <StoryCard
            key={i}
            story={{
              id: `demo-${i}`,
              title: `Adventure Story ${i}`,
              description: 'An exciting interactive adventure awaits...',
              coverImageUrl: null,
              category: 'fantasy',
              averageRating: 4.5,
              viewCount: 1000 * i,
              authorId: 'demo-author',
            } as Story}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} featured />
      ))}
    </div>
  );
}
