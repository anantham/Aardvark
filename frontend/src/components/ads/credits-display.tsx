'use client';

import { useState, useEffect } from 'react';
import { RewardAdButton } from './reward-ad-button';

interface CreditsDisplayProps {
  initialBalance?: number;
  showAdButton?: boolean;
  compact?: boolean;
  className?: string;
}

export function CreditsDisplay({
  initialBalance = 0,
  showAdButton = true,
  compact = false,
  className = '',
}: CreditsDisplayProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [isLoading, setIsLoading] = useState(true);
  const [recentEarning, setRecentEarning] = useState<number | null>(null);

  // Fetch current balance on mount
  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await fetch('/api/credits/balance');
        const data = await response.json();
        if (data.success) {
          setBalance(data.data.balance);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();
  }, []);

  const handleCreditsEarned = (amount: number, newBalance: number) => {
    setBalance(newBalance);
    setRecentEarning(amount);

    // Clear the earning notification after 3 seconds
    setTimeout(() => setRecentEarning(null), 3000);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <CoinIcon className="w-5 h-5 text-yellow-500" />
        <span className="font-semibold">
          {isLoading ? '...' : balance.toLocaleString()}
        </span>
        {recentEarning && (
          <span className="text-green-500 text-sm animate-pulse">
            +{recentEarning}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
            <CoinIcon className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Your Credits</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">
                {isLoading ? '...' : balance.toLocaleString()}
              </p>
              {recentEarning && (
                <span className="text-green-500 font-semibold animate-bounce">
                  +{recentEarning}
                </span>
              )}
            </div>
          </div>
        </div>

        {showAdButton && (
          <RewardAdButton
            onCreditsEarned={handleCreditsEarned}
            variant="default"
            size="default"
          />
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
        <p className="text-xs text-muted-foreground">
          Earn credits by watching ads, completing stories, or writing reviews.
          Use credits to unlock premium stories and tip your favorite authors.
        </p>
      </div>
    </div>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
    </svg>
  );
}
