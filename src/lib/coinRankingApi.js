/**
 * Simple utility to fetch coins from CoinRanking API
 */

// Function to fetch coins from CoinRanking API
export async function fetchCoins() {
    const apiKey = process.env.NEXT_PUBLIC_COIN_KEY
  
    if (!apiKey) {
      throw new Error("API key not found. Make sure NEXT_PUBLIC_COIN_KEY is set in your environment variables.")
    }
  
    try {
      // Check cache first (if in browser)
      if (typeof window !== "undefined") {
        const cachedData = localStorage.getItem("coinrankingData")
        const cacheTimestamp = localStorage.getItem("coinrankingTimestamp")
  
        // Use cache if it's less than 5 minutes old
        if (cachedData && cacheTimestamp) {
          const cacheAge = Date.now() - Number.parseInt(cacheTimestamp)
          if (cacheAge < 5 * 60 * 1000) {
            // 5 minutes
            console.log("Using cached coin data")
            return JSON.parse(cachedData)
          }
        }
      }
  
      // Fetch coins with a single API call
      console.log("Fetching coins from API...")
      const response = await fetch("https://api.coinranking.com/v2/coins?limit=100", {
        headers: {
          "x-access-token": apiKey,
          Accept: "application/json",
        },
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", response.status, errorText)
        throw new Error(`API error: ${response.status} - ${errorText || "Unknown error"}`)
      }
  
      const data = await response.json()
      const coins = data.data.coins
  
      // Save to cache if in browser
      if (typeof window !== "undefined") {
        localStorage.setItem("coinrankingData", JSON.stringify(coins))
        localStorage.setItem("coinrankingTimestamp", Date.now().toString())
      }
  
      console.log(`Successfully fetched ${coins.length} coins`)
      return coins
    } catch (error) {
      console.error("Error fetching coins:", error)
      throw new Error(`Failed to fetch coins: ${error.message}`)
    }
  }
  
  