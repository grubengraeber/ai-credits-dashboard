import { ProviderUsage } from "./types";
import { fetchOpenAIUsage } from "./openai";
import { fetchAnthropicUsage } from "./anthropic";
import { fetchElevenLabsUsage } from "./elevenlabs";
import { fetchGoogleUsage } from "./google";

export async function fetchProviderUsage(
  type: string,
  apiKey: string
): Promise<ProviderUsage> {
  switch (type) {
    case "openai":
      return fetchOpenAIUsage(apiKey);
    case "anthropic":
      return fetchAnthropicUsage(apiKey);
    case "elevenlabs":
      return fetchElevenLabsUsage(apiKey);
    case "google":
      return fetchGoogleUsage(apiKey);
    default:
      return { provider: type, type, error: "Unknown provider type" };
  }
}

export type { ProviderUsage };
