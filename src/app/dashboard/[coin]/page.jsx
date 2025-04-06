"use client";

import { useEffect, useState } from "react";
import Loading from "../../../components/dashboardComponents/loading";
import Error from "../../../components/dashboardComponents/error";
import { fetchCoinDetails, fetchCoinPriceHistory } from "@/lib/coinRankingApi";

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

export default function CoinDescription() {
  const [coinPriceHistory, setCoinPriceHistory] = useState([]);
  const [coinDetails, setCoinDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [uuid, setUuid] = useState(null);

  const loadCoinData = async (uuid) => {
    try {
      setIsLoading(true);
      setError(null);
      const [details, history] = await Promise.all([
        fetchCoinDetails(uuid),
        fetchCoinPriceHistory(uuid),
      ]);
      setCoinDetails(details);
      setCoinPriceHistory(history);
      setLastUpdated(formatTimestamp(new Date()));
    } catch (err) {
      setError(err.message || "Failed to load coin data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const pathUuid = window.location.pathname.split("/dashboard/").pop();
    setUuid(pathUuid);
    loadCoinData(pathUuid);
    const interval = setInterval(() => {
      loadCoinData(pathUuid);
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} loadCoins={() => loadCoinData(uuid)} />;

  return (
      <div className="flex flex-col items-left justify-center">
        <h1 className="text-2xl font-bold mb-4">{coinDetails.name} ({coinDetails.symbol})</h1>
        <p className="text-lg mb-2">Price: ${parseFloat(coinDetails.price).toLocaleString()}</p>
        <p className="text-lg mb-2">Market Cap: ${parseFloat(coinDetails.marketCap).toLocaleString()}</p>
        <p className="text-lg mb-4 text-center max-w-2xl">{coinDetails.description}</p>
        <p className="text-lg mb-2">Last Updated: {lastUpdated}</p>
      </div>
  );
}