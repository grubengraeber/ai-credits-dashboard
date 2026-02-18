"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ProviderCard } from "./ProviderCard";
import { AddProviderModal } from "./AddProviderModal";
import { RefreshCw, Plus, LogOut, Zap } from "lucide-react";

interface ProviderData {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  lastFetched: string | null;
  lastData: string | null;
}

export default function Dashboard() {
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(5);
  const router = useRouter();

  const fetchProviders = useCallback(async () => {
    const res = await fetch("/api/providers");
    if (res.ok) setProviders(await res.json());
    setLoading(false);
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await fetch("/api/providers/refresh", { method: "POST" });
    await fetchProviders();
    setRefreshing(false);
  }, [fetchProviders]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    if (autoRefresh <= 0) return;
    const interval = setInterval(refreshAll, autoRefresh * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshAll]);

  const deleteProvider = async (id: string) => {
    await fetch("/api/providers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProviders();
  };

  const handleSignOut = async () => {
    sessionStorage.removeItem("encryptionPassword");
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
            <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h1 className="text-base sm:text-xl font-bold truncate">AI Credits</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <select
              value={autoRefresh}
              onChange={(e) => setAutoRefresh(Number(e.target.value))}
              className="hidden sm:block bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value={0}>No auto-refresh</option>
              <option value={1}>Every 1 min</option>
              <option value={5}>Every 5 min</option>
              <option value={15}>Every 15 min</option>
              <option value={30}>Every 30 min</option>
            </select>
            <button
              onClick={refreshAll}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Provider</span>
            </button>
            <button
              onClick={handleSignOut}
              className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg transition"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-zinc-500" />
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <Zap className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-zinc-600" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">No providers configured</h2>
            <p className="text-zinc-400 text-sm mb-6">Add your first AI provider to start tracking credits</p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition"
            >
              Add Provider
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} onDelete={() => deleteProvider(p.id)} onRefresh={refreshAll} />
            ))}
          </div>
        )}
      </main>

      {showAdd && (
        <AddProviderModal
          onClose={() => setShowAdd(false)}
          onAdded={() => {
            setShowAdd(false);
            fetchProviders();
          }}
        />
      )}
    </div>
  );
}
