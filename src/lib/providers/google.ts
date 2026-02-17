import { ProviderUsage } from "./types";

export async function fetchGoogleUsage(apiKey: string): Promise<ProviderUsage> {
  try {
    // Google AI (Gemini) - check key validity via models list
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );

    if (!res.ok) {
      return { provider: "Google AI", type: "google", error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    const modelCount = data.models?.length || 0;

    return {
      provider: "Google AI",
      type: "google",
      details: {
        keyValid: true,
        modelsAvailable: modelCount,
        note: "Google AI billing managed via Google Cloud Console. API key validated.",
      },
    };
  } catch (e) {
    return { provider: "Google AI", type: "google", error: String(e) };
  }
}
