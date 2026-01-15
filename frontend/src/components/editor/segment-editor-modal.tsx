'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface StateEffect {
  variableId: string;
  variableName: string;
  operation: string;
  value: any;
}

interface SegmentData {
  id?: string;
  title: string;
  content: string;
  contentMarkdown: string;
  isEnding: boolean;
  endingType: 'good' | 'bad' | 'neutral' | 'secret' | null;
  stateEffects: StateEffect[];
}

interface SegmentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SegmentData) => void;
  initialData?: Partial<SegmentData>;
  stateVariables?: { id: string; name: string; displayName: string; type: string }[];
}

export function SegmentEditorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  stateVariables = [],
}: SegmentEditorModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEnding, setIsEnding] = useState(false);
  const [endingType, setEndingType] = useState<'good' | 'bad' | 'neutral' | 'secret' | null>(null);
  const [stateEffects, setStateEffects] = useState<StateEffect[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.contentMarkdown || initialData.content || '');
      setIsEnding(initialData.isEnding || false);
      setEndingType(initialData.endingType || null);
      setStateEffects(initialData.stateEffects || []);
    } else {
      setTitle('');
      setContent('');
      setIsEnding(false);
      setEndingType(null);
      setStateEffects([]);
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    onSave({
      id: initialData?.id,
      title,
      content: `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`,
      contentMarkdown: content,
      isEnding,
      endingType: isEnding ? endingType : null,
      stateEffects,
    });
    onClose();
  };

  const addStateEffect = () => {
    if (stateVariables.length === 0) return;
    setStateEffects([
      ...stateEffects,
      {
        variableId: stateVariables[0].id,
        variableName: stateVariables[0].name,
        operation: 'set',
        value: '',
      },
    ]);
  };

  const removeStateEffect = (index: number) => {
    setStateEffects(stateEffects.filter((_, i) => i !== index));
  };

  const updateStateEffect = (index: number, field: string, value: any) => {
    const updated = [...stateEffects];
    if (field === 'variableId') {
      const variable = stateVariables.find((v) => v.id === value);
      if (variable) {
        updated[index] = {
          ...updated[index],
          variableId: value,
          variableName: variable.name,
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setStateEffects(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-background rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {initialData?.id ? 'Edit Segment' : 'Create Segment'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title (optional)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chapter title..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story segment here..."
              className="w-full h-48 px-3 py-2 rounded-md border bg-background resize-y font-reading"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* Ending options */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEnding}
                onChange={(e) => setIsEnding(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">This is an ending segment</span>
            </label>

            {isEnding && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {(['good', 'bad', 'neutral', 'secret'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setEndingType(type)}
                    className={cn(
                      'px-3 py-2 rounded-md border text-sm capitalize',
                      endingType === type
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    )}
                  >
                    {type === 'good' && '🌟 '}
                    {type === 'bad' && '💀 '}
                    {type === 'neutral' && '🔵 '}
                    {type === 'secret' && '🔮 '}
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* State effects */}
          {stateVariables.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">State Effects</label>
                <Button onClick={addStateEffect} size="sm" variant="outline">
                  Add Effect
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Changes applied when the reader reaches this segment
              </p>

              {stateEffects.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No state effects</p>
              ) : (
                <div className="space-y-2">
                  {stateEffects.map((effect, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <select
                        value={effect.variableId}
                        onChange={(e) => updateStateEffect(index, 'variableId', e.target.value)}
                        className="flex-1 px-2 py-1 rounded border bg-background text-sm"
                      >
                        {stateVariables.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.displayName}
                          </option>
                        ))}
                      </select>
                      <select
                        value={effect.operation}
                        onChange={(e) => updateStateEffect(index, 'operation', e.target.value)}
                        className="w-24 px-2 py-1 rounded border bg-background text-sm"
                      >
                        <option value="set">Set</option>
                        <option value="add">Add</option>
                        <option value="subtract">Subtract</option>
                        <option value="toggle">Toggle</option>
                      </select>
                      <Input
                        value={effect.value}
                        onChange={(e) => updateStateEffect(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="w-24 h-8"
                      />
                      <button
                        onClick={() => removeStateEffect(index)}
                        className="p-1 hover:bg-destructive/10 rounded text-destructive"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!content.trim()}>
            {initialData?.id ? 'Save Changes' : 'Create Segment'}
          </Button>
        </div>
      </div>
    </div>
  );
}
