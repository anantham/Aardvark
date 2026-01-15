'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Flag,
  Users,
  FileWarning,
  BarChart3,
  Shield,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  pendingReports?: number;
  pendingQueue?: number;
}

const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/moderation-queue',
    label: 'Moderation Queue',
    icon: Flag,
    badge: 'pendingQueue',
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: FileWarning,
    badge: 'pendingReports',
  },
  {
    href: '/admin/users',
    label: 'User Management',
    icon: Users,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
];

/**
 * Admin navigation sidebar
 */
export function AdminSidebar({ pendingReports = 0, pendingQueue = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  const getBadgeCount = (badgeKey?: string) => {
    if (!badgeKey) return null;
    if (badgeKey === 'pendingReports') return pendingReports;
    if (badgeKey === 'pendingQueue') return pendingQueue;
    return null;
  };

  return (
    <aside className="w-64 border-r bg-card min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 px-3">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h2 className="font-semibold text-lg">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Platform Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const badgeCount = getBadgeCount(item.badge);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              {badgeCount !== null && badgeCount > 0 && (
                <Badge
                  variant={isActive ? 'secondary' : 'default'}
                  className="ml-auto"
                >
                  {badgeCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings link at bottom */}
      <div className="mt-auto pt-4 border-t">
        <Link
          href="/admin/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            pathname === '/admin/settings'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
