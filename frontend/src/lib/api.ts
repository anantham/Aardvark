const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Stories API
export const storiesApi = {
  getBySlug: (slug: string) => fetchApi<any>(`/stories/slug/${slug}`),
  getById: (id: string) => fetchApi<any>(`/stories/${id}`),
};

// Segments API
export const segmentsApi = {
  getById: (id: string) => fetchApi<any>(`/segments/${id}`),
  getByStory: (storyId: string) => fetchApi<any[]>(`/segments/story/${storyId}`),
  getStructure: (storyId: string) => fetchApi<any>(`/segments/story/${storyId}/structure`),
};

// Choices API
export const choicesApi = {
  getBySegment: (segmentId: string) => fetchApi<any[]>(`/choices/segment/${segmentId}`),
  getAvailable: (segmentId: string, state: Record<string, any>, visited: string[]) =>
    fetchApi<any[]>(`/choices/segment/${segmentId}/available?state=${JSON.stringify(state)}&visited=${visited.join(',')}`),
  recordChoice: (choiceId: string) =>
    fetchApi<void>(`/choices/${choiceId}/chosen`, { method: 'POST' }),
};

// Progress API
export const progressApi = {
  start: (storyId: string, token: string) =>
    fetchApi<any>('/progress/start', {
      method: 'POST',
      body: JSON.stringify({ storyId }),
      token,
    }),
  get: (storyId: string, token: string) =>
    fetchApi<any>(`/progress/story/${storyId}`, { token }),
  makeChoice: (storyId: string, choiceId: string, timeSpent: number, token: string) =>
    fetchApi<any>(`/progress/story/${storyId}/choice`, {
      method: 'POST',
      body: JSON.stringify({ choiceId, timeSpent }),
      token,
    }),
  navigate: (storyId: string, segmentId: string, token: string) =>
    fetchApi<any>(`/progress/story/${storyId}/navigate/${segmentId}`, {
      method: 'POST',
      token,
    }),
  reset: (storyId: string, token: string) =>
    fetchApi<any>(`/progress/story/${storyId}/reset`, {
      method: 'POST',
      token,
    }),
  addBookmark: (storyId: string, segmentId: string, note: string, token: string) =>
    fetchApi<any>(`/progress/story/${storyId}/bookmarks`, {
      method: 'POST',
      body: JSON.stringify({ segmentId, note }),
      token,
    }),
  removeBookmark: (storyId: string, segmentId: string, token: string) =>
    fetchApi<any>(`/progress/story/${storyId}/bookmarks/${segmentId}`, {
      method: 'DELETE',
      token,
    }),
};

export { fetchApi };
