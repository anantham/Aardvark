# Admin Dashboard Components

This directory contains admin dashboard components for the Aardvark interactive fiction platform.

## Components

### 1. StatsCard (`stats-card.tsx`)
Reusable statistic card component showing a metric with optional trend indicator.

**Props:**
- `title`: Card title
- `value`: Metric value (string or number)
- `description`: Optional description text
- `icon`: Lucide icon component
- `trend`: Optional trend object with `value` (percentage) and `label`
- `variant`: 'default' | 'success' | 'warning' | 'danger'

**Example:**
```tsx
import { StatsCard } from '@/components/admin';
import { Users } from 'lucide-react';

<StatsCard
  title="Total Users"
  value="12,458"
  description="Active platform users"
  icon={Users}
  trend={{ value: 12.5, label: 'vs last month' }}
  variant="success"
/>
```

### 2. ModerationQueueItem (`moderation-queue-item.tsx`)
Displays a content item in the moderation queue with actions.

**Props:**
- `item`: ModerationQueueItem object
- `onReview`: Callback when review button is clicked
- `onAssign`: Optional callback to assign item to current moderator

**Example:**
```tsx
import { ModerationQueueItemComponent } from '@/components/admin';

<ModerationQueueItemComponent
  item={queueItem}
  onReview={(item) => handleReview(item)}
  onAssign={(item) => handleAssign(item)}
/>
```

### 3. ReportDetailModal (`report-detail-modal.tsx`)
Modal for viewing and resolving content reports.

**Props:**
- `report`: Optional Report object
- `queueItem`: Optional ModerationQueueItem object
- `isOpen`: Boolean to control modal visibility
- `onClose`: Callback when modal is closed
- `onResolve`: Async callback with action and reason

**Example:**
```tsx
import { ReportDetailModal } from '@/components/admin';
import { ModerationAction } from '@aardvark/shared';

<ReportDetailModal
  report={selectedReport}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onResolve={async (action: ModerationAction, reason: string) => {
    await api.resolveReport(selectedReport.id, { action, reason });
  }}
/>
```

### 4. UserActionModal (`user-action-modal.tsx`)
Modal for taking moderation actions on users (warnings, bans).

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Callback when modal is closed
- `userId`: User ID
- `username`: Username
- `onWarn`: Async callback for warning action
- `onBan`: Async callback for ban action with type, scope, reason, and duration

**Example:**
```tsx
import { UserActionModal } from '@/components/admin';
import { BanType, BanScope } from '@aardvark/shared';

<UserActionModal
  isOpen={isUserModalOpen}
  onClose={() => setIsUserModalOpen(false)}
  userId={selectedUser.id}
  username={selectedUser.username}
  onWarn={async (reason) => {
    await api.warnUser(selectedUser.id, { reason });
  }}
  onBan={async (type: BanType, scope: BanScope, reason: string, durationDays?: number) => {
    await api.banUser(selectedUser.id, { type, scope, reason, durationDays });
  }}
/>
```

### 5. AdminLayout (`admin-layout.tsx`)
Layout component with sidebar navigation for admin pages.

**Props:**
- `children`: Page content
- `title`: Optional page title
- `description`: Optional page description
- `pendingReports`: Number of pending reports (for badge)
- `pendingQueue`: Number of pending queue items (for badge)
- `showBackButton`: Show back navigation button

**Example:**
```tsx
import { AdminLayout } from '@/components/admin';

export default function AdminDashboardPage() {
  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Platform overview and statistics"
      pendingReports={12}
      pendingQueue={8}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Your dashboard content */}
      </div>
    </AdminLayout>
  );
}
```

## Complete Dashboard Example

```tsx
'use client';

import { useState } from 'react';
import { AdminLayout, StatsCard, ModerationQueueItemComponent, ReportDetailModal } from '@/components/admin';
import { Users, Flag, CheckCircle, AlertTriangle } from 'lucide-react';
import { ModerationQueueItem, ModerationAction } from '@aardvark/shared';

export default function AdminDashboardPage() {
  const [selectedItem, setSelectedItem] = useState<ModerationQueueItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = {
    totalUsers: 12458,
    pendingReports: 23,
    resolvedToday: 45,
    activeFlags: 8,
  };

  const handleReview = (item: ModerationQueueItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleResolve = async (action: ModerationAction, reason: string) => {
    // Call your API here
    await fetch('/api/admin/moderation/resolve', {
      method: 'POST',
      body: JSON.stringify({ itemId: selectedItem?.id, action, reason }),
    });
    setIsModalOpen(false);
  };

  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Platform moderation and management"
      pendingReports={stats.pendingReports}
      pendingQueue={stats.activeFlags}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={{ value: 12.5, label: 'vs last month' }}
          variant="success"
        />
        <StatsCard
          title="Pending Reports"
          value={stats.pendingReports}
          icon={Flag}
          variant="warning"
        />
        <StatsCard
          title="Resolved Today"
          value={stats.resolvedToday}
          icon={CheckCircle}
          trend={{ value: 8.2, label: 'vs yesterday' }}
          variant="success"
        />
        <StatsCard
          title="Active Flags"
          value={stats.activeFlags}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Moderation Queue */}
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold">Recent Queue Items</h2>
        {/* Map your queue items here */}
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <ReportDetailModal
          queueItem={selectedItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onResolve={handleResolve}
        />
      )}
    </AdminLayout>
  );
}
```

## Features

- **Responsive Design**: All components are mobile-friendly
- **Type Safety**: Full TypeScript support with proper type definitions
- **Accessibility**: Built on Radix UI primitives with proper ARIA attributes
- **Consistent Styling**: Uses Tailwind CSS with shadcn/ui design system
- **Role-Based Access**: AdminLayout automatically checks user permissions
- **Real-time Updates**: Components support dynamic data updates

## Required Dependencies

- React 18+
- Next.js 13+ (App Router)
- Tailwind CSS
- Radix UI
- lucide-react
- date-fns
- @aardvark/shared (for type definitions)
