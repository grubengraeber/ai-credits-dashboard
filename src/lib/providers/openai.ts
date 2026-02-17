import { ProviderUsage } from "./types";

export async function fetchOpenAIUsage(apiKey: string): Promise<ProviderUsage> {
  try {
    // OpenAI billing - get organization usage
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const startTs = Math.floor(startDate.getTime() / 1000);
    const endTs = Math.floor(now.getTime() / 1000);

    const usageRes = await fetch(
      `https://api.openai.com/v1/usage?start_date=${startDate.toISOString().split("T")[0]}&end_date=${now.toISOString().split("T")[0]}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    // Try the admin API for costs
    const costsRes = await fetch(
      `https://api.openai.com/v1/organization/costs?start_time=${startTs}&end_time=${endTs}&group_by=line_item`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    let usageThisMonth = 0;
    if (costsRes.ok) {
      const costsData = await costsRes.json();
      if (costsData.data) {
        usageThisMonth = costsData.data.reduce(
          (sum: number, item: { results?: { amount?: { value?: number } }[] }) =>
            sum + (item.results?.[0]?.amount?.value || 0),
          0
        );
        // Convert from cents to dollars
        usageThisMonth = usageThisMonth / 100;
      }
    }

    return {
      provider: "OpenAI",
      type: "openai",
      usageThisMonth,
      currency: "USD",
      details: { note: "Cost-based billing" },
    };
  } catch (e) {
    return { provider: "OpenAI", type: "openai", error: String(e) };
  }
}
