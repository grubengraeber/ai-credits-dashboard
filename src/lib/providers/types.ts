export interface ProviderUsage {
  provider: string;
  type: string;
  balance?: number;
  creditsUsed?: number;
  creditsTotal?: number;
  usageThisMonth?: number;
  currency?: string;
  details?: Record<string, unknown>;
  error?: string;
}
