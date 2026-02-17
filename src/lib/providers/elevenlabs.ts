import { ProviderUsage } from "./types";

export async function fetchElevenLabsUsage(apiKey: string): Promise<ProviderUsage> {
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
      headers: { "xi-api-key": apiKey },
    });

    if (!res.ok) {
      return { provider: "ElevenLabs", type: "elevenlabs", error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return {
      provider: "ElevenLabs",
      type: "elevenlabs",
      creditsUsed: data.character_count,
      creditsTotal: data.character_limit,
      details: {
        tier: data.tier,
        characterCount: data.character_count,
        characterLimit: data.character_limit,
        nextReset: data.next_character_count_reset_unix,
        voiceCount: data.voice_limit,
      },
    };
  } catch (e) {
    return { provider: "ElevenLabs", type: "elevenlabs", error: String(e) };
  }
}
