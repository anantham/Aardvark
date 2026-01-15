'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UPIPayoutSetupProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface PayoutAccount {
  id: string;
  upiVpa: string;
  accountHolderName: string;
  verified: boolean;
  payoutsEnabled: boolean;
}

export function UPIPayoutSetup({ onSuccess, onError }: UPIPayoutSetupProps) {
  const [upiVpa, setUpiVpa] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<PayoutAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate UPI VPA format
      const upiRegex = /^[\w.-]+@[\w]+$/;
      if (!upiRegex.test(upiVpa)) {
        throw new Error('Invalid UPI ID format. Example: username@upi');
      }

      const response = await fetch('/api/payments/upi/payout-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upiVpa,
          accountHolderName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAccount(data.data);
        onSuccess?.();
      } else {
        throw new Error(data.error || 'Failed to setup payout account');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Setup failed';
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (account) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
            <CheckIcon className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">UPI Payout Account Active</h3>
            <p className="text-sm text-muted-foreground">
              Your earnings will be sent to this UPI ID
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-800">
            <span className="text-sm text-muted-foreground">UPI ID</span>
            <span className="font-mono font-medium">{account.upiVpa}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-800">
            <span className="text-sm text-muted-foreground">Account Holder</span>
            <span className="font-medium">{account.accountHolderName}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Verified
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setAccount(null)}
        >
          Update UPI ID
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <BankIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Setup UPI Payout Account</h3>
          <p className="text-sm text-muted-foreground">
            Receive your author earnings directly via UPI
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="upiVpa" className="block text-sm font-medium mb-2">
            UPI ID (VPA)
          </label>
          <Input
            id="upiVpa"
            type="text"
            placeholder="yourname@upi"
            value={upiVpa}
            onChange={(e) => setUpiVpa(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Examples: yourname@ybl, yourname@paytm, 9876543210@upi
          </p>
        </div>

        <div>
          <label htmlFor="accountHolderName" className="block text-sm font-medium mb-2">
            Account Holder Name
          </label>
          <Input
            id="accountHolderName"
            type="text"
            placeholder="Your full name as per bank records"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner className="w-4 h-4" />
              Verifying...
            </span>
          ) : (
            'Setup UPI Payout Account'
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Minimum payout threshold: 500. Payouts are processed within 24-48 hours.
        </p>
      </form>
    </div>
  );
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function BankIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
