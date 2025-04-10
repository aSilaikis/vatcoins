"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/dashboardComponents/loading";
import Error from "@/components/dashboardComponents/error";
import { fetchCoinDetails } from "@/lib/coinRankingApi";
import SparklineChart from "@/components/descriptionComponents/sparklineChart";
import HistoryChart from "@/components/descriptionComponents/historyChart";
import { Save, SaveOff } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [coinDetails, setCoinDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const loadCoinData = async (uuid) => {
    try {
      setIsLoading(true);
      setError(null);
      const details = await fetchCoinDetails(uuid);
      setCoinDetails(details);
      setLastUpdated(formatTimestamp(new Date()));
    } catch (err) {
      setError(err.message || "Failed to load coin data");
    } finally {
      setIsLoading(false);
    }
  };

  const checkWatchlist = async (pathUuid) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }

      const { watchlist: uuidList } = await response.json();
      const isCoinSaved = uuidList.includes(pathUuid);
      setIsSaved(isCoinSaved);
    } catch (err) {
      setError(err.message || "Failed to check watchlist");
    }
  };

  useEffect(() => {
    const pathUuid = window.location.pathname.split("/dashboard/").pop();
    setUuid(pathUuid);

    const initializeData = async () => {
      await loadCoinData(pathUuid);
      await checkWatchlist(pathUuid);
    };
    initializeData();

    const interval = setInterval(() => {
      loadCoinData(pathUuid);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const toggleSave = async () => {
    try {
      const endpoint = "/api/watchlist";
      const method = isSaved ? "DELETE" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ coinUuid: uuid }),
      });

      if (!response.ok) {
        throw new Error("Failed to update watchlist");
      }

      setIsSaved(!isSaved);
    } catch (err) {
      setError(err.message || "Failed to update watchlist");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} loadCoins={() => loadCoinData(uuid)} />;

  return (
    <>
      <Card className="flex w-[95%] mx-auto gap-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">
              {coinDetails.name} ({coinDetails.symbol})
            </CardTitle>
            <Button
              onClick={toggleSave}
              className="w-12 h-12 rounded-full"
            >
              {isSaved ? (
                <SaveOff className="w-6 h-6" />
              ) : (
                <Save className="w-6 h-6" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-1 justify-between w-full">

            <div className="flex flex-row items-center w-1/3 gap-10">
              <img
                src={coinDetails.iconUrl}
                alt={`${coinDetails.name} icon`}
                className="w-48 h-48 rounded-full"
              />
              <div className="flex flex-col gap-2">
                <p className="text-md">
                  <span className="text-lg font-semibold ">Price:</span> ${parseFloat(coinDetails.price).toLocaleString()}
                </p>
                <p className="text-md"><span className="text-lg font-semibold ">Rank:</span> {coinDetails.rank}</p>
                <p className="text-md">
                  <span className="text-lg font-semibold">Change: </span>
                  <span
                    className={`${
                      coinDetails.change >= 0 ? "text-green-500" : "text-red-500"
                    } font-semibold`}
                  >
                    {coinDetails.change}%
                  </span>
                </p>
                <p className="text-md">
                  <span className="text-lg font-semibold ">Market Cap:</span> ${parseFloat(coinDetails.marketCap).toLocaleString()}
                </p>
                <p className="text-md">
                  <span className="text-lg font-semibold ">24h Volume:</span> ${parseFloat(coinDetails["24hVolume"]).toLocaleString()}
                </p>
                <p className="text-md">
                  <span className="text-lg font-semibold ">Circulating Supply: $</span>{parseFloat(coinDetails.supply?.circulating).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="w-1/4">
              <h3 className="text-2xl font-semibold mb-2">Links</h3>
              <div className="flex flex-wrap gap-2">
                {coinDetails.links?.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-1 rounded-full bg-gray-200 dark:bg-black text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-800 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="w-1/3">
              <SparklineChart coinDetails={coinDetails} />
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Last Updated: {lastUpdated}
          </p>
        </CardContent>
      </Card>
      <HistoryChart uuid={uuid} />
    </>
  );
}