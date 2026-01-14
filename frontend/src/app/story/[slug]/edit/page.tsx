'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ReviewDashboard } from '@/components/submissions';

// Dynamically import the visual editor to avoid SSR issues with React Flow
const VisualEditorWithProvider = dynamic(
  () => import('@/components/editor').then((mod) => mod.VisualEditorWithProvider),
  { ssr: false, loading: () => <EditorSkeleton /> }
);

function EditorSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  );
}

// Types
interface Story {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  collaborationMode: string;
  rootSegmentId: string | null;
}

interface Segment {
  id: string;
  title: string | null;
  content: string;
  contentMarkdown: string | null;
  position: { x: number; y: number };
  isRootSegment: boolean;
  isEnding: boolean;
  endingType: 'good' | 'bad' | 'neutral' | 'secret' | null;
  wordCount: number;
  stateEffects: any[];
}

interface Choice {
  id: string;
  segmentId: string;
  nextSegmentId: string;
  choiceText: string;
  order: number;
  conditions: any[];
}

interface StateVariable {
  id: string;
  name: string;
  displayName: string;
  type: string;
}

interface BranchSubmission {
  id: string;
  segmentData: {
    title: string | null;
    content: string;
    isEnding: boolean;
    endingType: 'good' | 'bad' | 'neutral' | 'secret' | null;
  };
  choicesData: {
    choiceText: string;
    order: number;
  }[];
  submissionNote: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  submittedBy: {
    id: string;
    username: string;
    displayName: string;
  };
  parentSegment: {
    id: string;
    title: string | null;
  };
  reviewNote: string | null;
  createdAt: string;
}

// Mock API - replace with actual API calls
const mockStory: Story = {
  id: '1',
  title: 'The Dragon\'s Choice',
  slug: 'the-dragons-choice',
  description: 'An epic adventure where your choices determine your fate.',
  status: 'draft',
  collaborationMode: 'moderated',
  rootSegmentId: 'seg-1',
};

const mockSegments: Segment[] = [
  {
    id: 'seg-1',
    title: 'The Beginning',
    content: '<p>You stand at the entrance of a dark cave...</p>',
    contentMarkdown: 'You stand at the entrance of a dark cave...',
    position: { x: 250, y: 50 },
    isRootSegment: true,
    isEnding: false,
    endingType: null,
    wordCount: 45,
    stateEffects: [],
  },
  {
    id: 'seg-2',
    title: 'The Careful Path',
    content: '<p>You raise your torch higher...</p>',
    contentMarkdown: 'You raise your torch higher...',
    position: { x: 100, y: 200 },
    isRootSegment: false,
    isEnding: false,
    endingType: null,
    wordCount: 38,
    stateEffects: [{ variableName: 'careful', operation: 'set', value: true }],
  },
  {
    id: 'seg-3',
    title: 'A Voice in the Dark',
    content: '<p>"Hello?" Your voice echoes...</p>',
    contentMarkdown: '"Hello?" Your voice echoes...',
    position: { x: 400, y: 200 },
    isRootSegment: false,
    isEnding: false,
    endingType: null,
    wordCount: 42,
    stateEffects: [{ variableName: 'dragon_aware', operation: 'set', value: true }],
  },
  {
    id: 'seg-4',
    title: 'Darkness Embraces You',
    content: '<p>You extinguish your torch...</p>',
    contentMarkdown: 'You extinguish your torch...',
    position: { x: 250, y: 350 },
    isRootSegment: false,
    isEnding: true,
    endingType: 'neutral',
    wordCount: 55,
    stateEffects: [],
  },
];

const mockChoices: Choice[] = [
  {
    id: 'c1',
    segmentId: 'seg-1',
    nextSegmentId: 'seg-2',
    choiceText: 'Proceed cautiously with your torch held high',
    order: 1,
    conditions: [],
  },
  {
    id: 'c2',
    segmentId: 'seg-1',
    nextSegmentId: 'seg-3',
    choiceText: 'Call out to see if anyone responds',
    order: 2,
    conditions: [],
  },
  {
    id: 'c3',
    segmentId: 'seg-2',
    nextSegmentId: 'seg-4',
    choiceText: 'Continue into the darkness',
    order: 1,
    conditions: [],
  },
];

const mockStateVariables: StateVariable[] = [
  { id: 'var-1', name: 'careful', displayName: 'Careful Approach', type: 'boolean' },
  { id: 'var-2', name: 'dragon_aware', displayName: 'Dragon Awareness', type: 'boolean' },
  { id: 'var-3', name: 'trust_level', displayName: 'Trust Level', type: 'number' },
];

const mockSubmissions: BranchSubmission[] = [
  {
    id: 'sub-1',
    segmentData: {
      title: 'The Dragon Awakens',
      content: '<p>The dragon slowly opens one eye, its golden pupil focusing on you...</p>',
      isEnding: false,
      endingType: null,
    },
    choicesData: [{ choiceText: 'Approach the dragon cautiously', order: 1 }],
    submissionNote: 'This branch explores what happens when you actually meet the dragon.',
    status: 'pending',
    submittedBy: { id: 'user-2', username: 'dragonwriter', displayName: 'Dragon Writer' },
    parentSegment: { id: 'seg-3', title: 'A Voice in the Dark' },
    reviewNote: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    segmentData: {
      title: 'Hidden Treasure',
      content: '<p>Behind a loose stone, you discover a cache of ancient gold coins...</p>',
      isEnding: true,
      endingType: 'good',
    },
    choicesData: [{ choiceText: 'Search the walls carefully', order: 1 }],
    submissionNote: 'A secret good ending for careful explorers!',
    status: 'pending',
    submittedBy: { id: 'user-3', username: 'treasurehunter', displayName: 'Treasure Hunter' },
    parentSegment: { id: 'seg-2', title: 'The Careful Path' },
    reviewNote: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function StoryEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [story, setStory] = useState<Story | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [stateVariables, setStateVariables] = useState<StateVariable[]>([]);
  const [submissions, setSubmissions] = useState<BranchSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visual' | 'settings' | 'variables' | 'submissions'>('visual');

  // Load story data
  useEffect(() => {
    async function loadStory() {
      try {
        // Mock API call - replace with actual
        await new Promise((resolve) => setTimeout(resolve, 500));
        setStory(mockStory);
        setSegments(mockSegments);
        setChoices(mockChoices);
        setStateVariables(mockStateVariables);
        setSubmissions(mockSubmissions);
      } catch (error) {
        console.error('Failed to load story:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStory();
  }, [slug]);

  // API handlers - replace with actual API calls
  const handleSegmentCreate = async (segment: Partial<Segment>): Promise<Segment> => {
    const newSegment: Segment = {
      id: `seg-${Date.now()}`,
      title: segment.title || null,
      content: segment.content || '',
      contentMarkdown: segment.contentMarkdown || null,
      position: segment.position || { x: 250, y: 250 },
      isRootSegment: segments.length === 0,
      isEnding: segment.isEnding || false,
      endingType: segment.endingType || null,
      wordCount: segment.content?.split(/\s+/).length || 0,
      stateEffects: segment.stateEffects || [],
    };
    setSegments((prev) => [...prev, newSegment]);
    return newSegment;
  };

  const handleSegmentUpdate = async (id: string, data: Partial<Segment>): Promise<void> => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const handleSegmentDelete = async (id: string): Promise<void> => {
    setSegments((prev) => prev.filter((s) => s.id !== id));
    setChoices((prev) => prev.filter((c) => c.segmentId !== id && c.nextSegmentId !== id));
  };

  const handleChoiceCreate = async (choice: Partial<Choice>): Promise<Choice> => {
    const newChoice: Choice = {
      id: `choice-${Date.now()}`,
      segmentId: choice.segmentId!,
      nextSegmentId: choice.nextSegmentId!,
      choiceText: choice.choiceText || 'New choice',
      order: choices.filter((c) => c.segmentId === choice.segmentId).length + 1,
      conditions: [],
    };
    setChoices((prev) => [...prev, newChoice]);
    return newChoice;
  };

  const handleChoiceDelete = async (id: string): Promise<void> => {
    setChoices((prev) => prev.filter((c) => c.id !== id));
  };

  const handlePositionsUpdate = async (
    positions: { segmentId: string; x: number; y: number }[]
  ): Promise<void> => {
    setSegments((prev) =>
      prev.map((s) => {
        const pos = positions.find((p) => p.segmentId === s.id);
        return pos ? { ...s, position: { x: pos.x, y: pos.y } } : s;
      })
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="h-14 border-b px-4 flex items-center gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1">
          <EditorSkeleton />
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b px-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-4">
          <Link
            href={`/story/${slug}`}
            className="p-2 -ml-2 hover:bg-muted rounded-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="font-semibold">{story.title}</h1>
            <p className="text-xs text-muted-foreground">
              {story.status === 'draft' ? 'Draft' : 'Published'} · {segments.length} segments
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'visual'
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            Visual Editor
          </button>
          <button
            onClick={() => setActiveTab('variables')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'variables'
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            Variables
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'settings'
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            Settings
          </button>
          {story.collaborationMode !== 'private' && (
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors relative ${
                activeTab === 'submissions'
                  ? 'bg-background shadow-sm'
                  : 'hover:bg-background/50'
              }`}
            >
              Submissions
              {submissions.filter((s) => s.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {submissions.filter((s) => s.status === 'pending').length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/story/${slug}/read`}>Preview</Link>
          </Button>
          <Button size="sm">Publish</Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'visual' && (
          <VisualEditorWithProvider
            storyId={story.id}
            segments={segments}
            choices={choices}
            stateVariables={stateVariables}
            onSegmentCreate={handleSegmentCreate}
            onSegmentUpdate={handleSegmentUpdate}
            onSegmentDelete={handleSegmentDelete}
            onChoiceCreate={handleChoiceCreate}
            onChoiceDelete={handleChoiceDelete}
            onPositionsUpdate={handlePositionsUpdate}
          />
        )}

        {activeTab === 'variables' && (
          <div className="p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">State Variables</h2>
                <p className="text-muted-foreground">
                  Define variables to track reader choices and unlock conditional content
                </p>
              </div>
              <Button>Add Variable</Button>
            </div>

            {stateVariables.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground mb-4">No variables defined yet</p>
                <Button variant="outline">Create your first variable</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {stateVariables.map((variable) => (
                  <div
                    key={variable.id}
                    className="p-4 border rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{variable.displayName}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {variable.name} ({variable.type})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Story Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  defaultValue={story.title}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  defaultValue={story.description}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Collaboration Mode</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="private">Private - Only you can edit</option>
                  <option value="moderated">Moderated - Others can submit branches for approval</option>
                  <option value="open">Open - Anyone can add branches</option>
                </select>
              </div>
              <Button>Save Settings</Button>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <ReviewDashboard
            submissions={submissions}
            onReview={async (submissionId, status, reviewNote) => {
              // Mock API call - replace with actual
              setSubmissions((prev) =>
                prev.map((s) =>
                  s.id === submissionId
                    ? { ...s, status, reviewNote: reviewNote || null }
                    : s
                )
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
