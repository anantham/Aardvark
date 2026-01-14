'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';

export interface SegmentNodeData {
  id: string;
  title: string | null;
  content: string;
  isRootSegment: boolean;
  isEnding: boolean;
  endingType: 'good' | 'bad' | 'neutral' | 'secret' | null;
  wordCount: number;
  choiceCount: number;
  isSelected?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function SegmentNodeComponent({ data, selected }: NodeProps<SegmentNodeData>) {
  const endingColors = {
    good: 'border-green-500 bg-green-50 dark:bg-green-950/30',
    bad: 'border-red-500 bg-red-50 dark:bg-red-950/30',
    neutral: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
    secret: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30',
  };

  // Strip HTML tags for preview
  const plainText = data.content.replace(/<[^>]*>/g, '').substring(0, 100);

  return (
    <div
      className={cn(
        'min-w-[200px] max-w-[280px] rounded-lg border-2 bg-card shadow-md transition-all',
        selected && 'ring-2 ring-primary ring-offset-2',
        data.isRootSegment && 'border-primary',
        data.isEnding && data.endingType && endingColors[data.endingType],
        !data.isRootSegment && !data.isEnding && 'border-border'
      )}
    >
      {/* Input handle (not for root) */}
      {!data.isRootSegment && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-primary !border-2 !border-background"
        />
      )}

      {/* Header */}
      <div className="px-3 py-2 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {data.isRootSegment && '🏠 Start'}
            {data.isEnding && `🏁 ${data.endingType || 'Ending'}`}
            {!data.isRootSegment && !data.isEnding && '📄 Segment'}
          </span>
          <span className="text-xs text-muted-foreground">
            {data.wordCount} words
          </span>
        </div>
        <h3 className="font-medium truncate mt-1">
          {data.title || 'Untitled Segment'}
        </h3>
      </div>

      {/* Content preview */}
      <div className="px-3 py-2">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {plainText || 'No content yet...'}
        </p>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t bg-muted/30 rounded-b-lg flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {data.choiceCount} choice{data.choiceCount !== 1 && 's'}
        </span>
        <div className="flex gap-1">
          {data.onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onEdit?.(data.id);
              }}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {data.onDelete && !data.isRootSegment && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onDelete?.(data.id);
              }}
              className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Output handle (not for endings) */}
      {!data.isEnding && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-primary !border-2 !border-background"
        />
      )}
    </div>
  );
}

export const SegmentNode = memo(SegmentNodeComponent);
