'use client';

import { memo } from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from 'reactflow';

export interface ChoiceEdgeData {
  id: string;
  choiceText: string;
  order: number;
  hasConditions: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function ChoiceEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<ChoiceEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Truncate choice text for display
  const displayText = data?.choiceText
    ? data.choiceText.length > 30
      ? data.choiceText.substring(0, 30) + '...'
      : data.choiceText
    : 'Choice';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div
            className={`
              px-2 py-1 rounded-md text-xs font-medium
              bg-background border shadow-sm
              max-w-[150px] truncate
              ${selected ? 'border-primary ring-1 ring-primary' : 'border-border'}
              ${data?.hasConditions ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300' : ''}
            `}
          >
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">{data?.order || 1}.</span>
              <span className="truncate">{displayText}</span>
              {data?.hasConditions && (
                <span title="Has conditions" className="text-amber-600">⚡</span>
              )}
            </div>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const ChoiceEdge = memo(ChoiceEdgeComponent);
