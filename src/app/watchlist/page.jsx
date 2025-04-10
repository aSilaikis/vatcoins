"use client";

import { useEffect, useState } from "react";
import EmptyWatchlist from "@/components/watchlistComponents/emptyWatchlist";
import WatchlistCard from "@/components/watchlistComponents/watchlistCard";
import Loading from "@/components/dashboardComponents/loading";
import Error from "@/components/dashboardComponents/error";
import { fetchCoinDetails } from "@/lib/coinRankingApi";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const formatTimestamp = (date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const loadCoins = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/watchlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }

      const { watchlist: uuidList } = await response.json();

      const coinDetailsPromises = uuidList.map((uuid) => fetchCoinDetails(uuid));
      const coinDetails = await Promise.all(coinDetailsPromises);

      setWatchlist(coinDetails);
      setLastUpdated(formatTimestamp(new Date()));
    } catch (err) {
      setError(err.message || "Failed to load watchlist data");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWatchlistHandler = async (coinUuid) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coinUuid }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove from watchlist");
      }

      await loadCoins();
    } catch (err) {
      setError(err.message || "Failed to remove item");
    }
  };

  useEffect(() => {
    loadCoins();
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} loadCoins={loadCoins} />;

  return (
    <div className="container mx-auto py-1 px-4">
      <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>
      {lastUpdated && (
        <p className="text-sm mb-4">
          Last updated: {lastUpdated}
        </p>
      )}
      {watchlist.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((coin) => (
            <WatchlistCard
              key={coin.uuid}
              coin={coin}
              removeFromWatchlistHandler={removeFromWatchlistHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
}