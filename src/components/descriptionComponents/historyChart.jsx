"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import Loading from "@/components/dashboardComponents/loading"
import Error from "@/components/dashboardComponents/error"
import { fetchCoinPriceHistory } from "@/lib/coinRankingApi"

export default function HistoryChart({ uuid }) {
  const [historyData, setHistoryData] = useState([])
  const [timePeriod, setTimePeriod] = useState("24h")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const timePeriods = ["1h", "3h", "12h", "24h", "7d", "30d", "3m", "1y", "3y", "5y"]

  const loadPriceHistory = async (period) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchCoinPriceHistory(uuid, period)
      const formattedData = data
        .map((entry) => ({
          time: new Date(entry.timestamp * 1000).toLocaleString(),
          timestamp: entry.timestamp * 1000,
          price: Number.parseFloat(entry.price),
        }))
        .sort((a, b) => a.timestamp - b.timestamp)

      setHistoryData(formattedData)
    } catch (err) {
      setError(err.message || "Failed to load price history")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPriceHistory(timePeriod)
  }, [timePeriod, uuid])

  const priceChange = historyData.length
    ? ((historyData[historyData.length - 1].price - historyData[0].price) / historyData[0].price) * 100
    : 0

  const startPrice = historyData.length > 0 ? historyData[0].price : 0

  const prices = historyData.map((entry) => entry.price)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0
  const priceRange = maxPrice - minPrice
  const yAxisDomain = [minPrice - priceRange * 0.05, maxPrice + priceRange * 0.05]

  const chartColor = priceChange >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"

  const chartConfig = {
    price: {
      label: "Price",
      color: chartColor,
    },
  }

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp)
    if (timePeriod.includes("h")) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (timePeriod === "7d") {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const formatYAxis = (value) => {
    if (value < 0.01) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      }).format(value)
    }
    else if (value < 1) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(value)
    }
    else if (value < 1000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    }
    else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 2,
      }).format(value)
    }
  }

  const formatTooltipValue = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value)
  }

  const calculateTickCount = () => {
    if (minPrice < 0.01) return 10
    if (minPrice < 1) return 8
    return 6
  }

  if (isLoading) return <Loading />
  if (error) return <Error error={error} loadCoins={() => loadPriceHistory(timePeriod)} />

  return (
    <Card className="w-[95%] mx-auto mt-2 gap-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Price History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={timePeriod} onValueChange={setTimePeriod} className="w-full">
          <TabsList className="flex justify-start mb-2 overflow-x-auto">
            {timePeriods.map((period) => (
              <TabsTrigger key={period} value={period} className="data-[state=active]:bg-muted">
                {period}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="w-full h-[400px] dark:bg-[#0e0e0e] bg-[#f5f8fa] rounded-md p-2">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 12, fill: "#888" }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  minTickGap={30}
                />
                <YAxis
                  domain={yAxisDomain}
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 12, fill: "#888" }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  tickCount={calculateTickCount()}
                  allowDecimals={true}
                  interval={0}
                />
                <ReferenceLine y={startPrice} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                <Tooltip
                  formatter={(value) => [formatTooltipValue(value), "Price"]}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={chartColor}
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}