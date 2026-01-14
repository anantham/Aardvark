'use client';

import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast notification provider using react-hot-toast.
 * Provides consistent toast notifications across the application.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
          },
          // Success toast styling
          success: {
            iconTheme: {
              primary: 'hsl(142.1 76.2% 36.3%)',
              secondary: 'hsl(var(--card))',
            },
          },
          // Error toast styling
          error: {
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--card))',
            },
            duration: 5000,
          },
        }}
        containerStyle={{
          bottom: 80, // Account for mobile navigation
        }}
      />
    </>
  );
}
