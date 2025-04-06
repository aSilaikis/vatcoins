"use client";

import { useEffect, useState } from "react";
import Loading from "../../components/dashboardComponents/loading";
import Error from "../../components/dashboardComponents/error";
import CoinCard from "@/components/dashboardComponents/coinCard";
import { fetchCoins } from "@/lib/coinRankingApi";

const REFRESH_INTERVAL = 5 * 60 * 1000;

const formatTimestamp = (date) => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
};

export default function CoinsPage() {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadCoins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCoins();
      setCoins(data);
      setLastUpdated(formatTimestamp(new Date()));
    } catch (err) {
      setError(err.message || "Failed to load coin data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoins();

    const interval = setInterval(() => {
      loadCoins();
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} loadCoins={loadCoins} />;

  return (
    <div className="container mx-auto py-1 px-4">
      <CoinCard lastUpdated={lastUpdated} coins={coins} loadCoins={loadCoins} />
    </div>
  );
}