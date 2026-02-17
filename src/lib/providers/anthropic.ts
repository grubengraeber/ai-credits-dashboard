import { ProviderUsage } from "./types";

export async function fetchAnthropicUsage(apiKey: string): Promise<ProviderUsage> {
  try {
    // Anthropic doesn't have a public billing API yet
    // We can check if the key is valid by making a small request
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1,
        messages: [{ role: "user", content: "hi" }],
      }),
    });

    const valid = res.ok || res.status === 429;

    return {
      provider: "Anthropic",
      type: "anthropic",
      details: {
        keyValid: valid,
        note: "Anthropic billing available via console. API key validated.",
        status: valid ? "active" : "invalid key",
      },
    };
  } catch (e) {
    return { provider: "Anthropic", type: "anthropic", error: String(e) };
  }
}
