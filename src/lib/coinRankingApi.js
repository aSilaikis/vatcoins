export async function fetchCoins() {
  const apiKey = process.env.NEXT_PUBLIC_COIN_KEY;

  if (!apiKey) {
    throw new Error("API key not found. Make sure NEXT_PUBLIC_COIN_KEY is set in your environment variables.");
  }

  try {
    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem("coinrankingData");
      const cacheTimestamp = localStorage.getItem("coinrankingTimestamp");

      if (cachedData && cacheTimestamp) {
        const cacheAge = Date.now() - Number.parseInt(cacheTimestamp);
        if (cacheAge < 5 * 60 * 1000) {
          return JSON.parse(cachedData);
        }
      }
    }
    const response = await fetch("https://api.coinranking.com/v2/coins?limit=100", {
      headers: {
        "x-access-token": apiKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText || "Unknown error"}`);
    }

    const data = await response.json();
    const coins = data.data.coins;

    if (typeof window !== "undefined") {
      localStorage.setItem("coinrankingData", JSON.stringify(coins));
      localStorage.setItem("coinrankingTimestamp", Date.now().toString());
    }

    return coins;
  } catch (error) {
    console.error("Error fetching coins:", error);
    throw new Error(`Failed to fetch coins: ${error.message}`);
  }
}

export async function fetchCoinDetails(uuid) {
  const apiKey = process.env.NEXT_PUBLIC_COIN_KEY;

  if (!apiKey) {
    throw new Error("API key not found.");
  }

  try {
    const response = await fetch(`https://api.coinranking.com/v2/coin/${uuid}`, {
      headers: {
        "x-access-token": apiKey,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data.coin;
  } catch (error) {
    console.error("Error fetching coin details:", error);
    throw new Error(`Failed to fetch coin details: ${error.message}`);
  }
}

export async function fetchCoinPriceHistory(uuid, timePeriod = "1y") {
  const apiKey = process.env.NEXT_PUBLIC_COIN_KEY;

  if (!apiKey) {
    throw new Error("API key not found.");
  }

  try {
    const response = await fetch(
      `https://api.coinranking.com/v2/coin/${uuid}/history?timePeriod=${timePeriod}`,
      {
        headers: {
          "x-access-token": apiKey,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data.history;
  } catch (error) {
    console.error("Error fetching coin price history:", error);
    throw new Error(`Failed to fetch coin price history: ${error.message}`);
  }
}