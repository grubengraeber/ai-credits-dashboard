"use client";

import { Trash2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  provider: {
    id: string;
    name: string;
    type: string;
    enabled: boolean;
    lastFetched: string | null;
    lastData: string | null;
  };
  onDelete: () => void;
  onRefresh: () => void;
}

const PROVIDER_COLORS: Record<string, string> = {
  openai: "from-emerald-600 to-emerald-800",
  anthropic: "from-orange-600 to-orange-800",
  elevenlabs: "from-purple-600 to-purple-800",
  google: "from-blue-600 to-blue-800",
};

const PROVIDER_ICONS: Record<string, string> = {
  openai: "🤖",
  anthropic: "🧠",
  elevenlabs: "🔊",
  google: "✨",
};

export function ProviderCard({ provider, onDelete, onRefresh }: Props) {
  const data = provider.lastData ? JSON.parse(provider.lastData) : null;
  const color = PROVIDER_COLORS[provider.type] || "from-zinc-600 to-zinc-800";
  const icon = PROVIDER_ICONS[provider.type] || "⚡";

  const formatDate = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleString();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-zinc-700 transition">
      {/* Header gradient */}
      <div className={`bg-gradient-to-r ${color} px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">{icon}</span>
          <div>
            <h3 className="font-bold text-base sm:text-lg">{provider.name}</h3>
            <p className="text-xs sm:text-sm text-white/60 capitalize">{provider.type}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={onRefresh} className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1.5 sm:p-2 hover:bg-red-500/40 rounded-lg transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {data?.error ? (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{data.error}</span>
          </div>
        ) : data ? (
          <>
            {data.creditsUsed !== undefined && data.creditsTotal !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">Characters Used</span>
                  <span className="font-mono text-xs sm:text-sm">
                    {data.creditsUsed.toLocaleString()} / {data.creditsTotal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((data.creditsUsed / data.creditsTotal) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {((data.creditsUsed / data.creditsTotal) * 100).toFixed(1)}% used
                </p>
              </div>
            )}

            {data.usageThisMonth !== undefined && (
              <div>
                <p className="text-zinc-400 text-sm">Usage This Month</p>
                <p className="text-xl sm:text-2xl font-bold font-mono">
                  ${data.usageThisMonth.toFixed(2)}
                  {data.currency && <span className="text-sm text-zinc-500 ml-1">{data.currency}</span>}
                </p>
              </div>
            )}

            {data.balance !== undefined && (
              <div>
                <p className="text-zinc-400 text-sm">Balance</p>
                <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">${data.balance.toFixed(2)}</p>
              </div>
            )}

            {data.details && (
              <div className="space-y-1">
                {Object.entries(data.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-zinc-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="text-zinc-300 font-mono">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1 text-emerald-400 text-xs">
              <CheckCircle2 className="w-3 h-3" />
              Connected
            </div>
          </>
        ) : (
          <p className="text-zinc-500 text-sm">No data yet. Click refresh to fetch.</p>
        )}

        <p className="text-xs text-zinc-600">Last updated: {formatDate(provider.lastFetched)}</p>
      </div>
    </div>
  );
}
