"use client"

import { useEffect, useState } from "react"
import Loading from "../../components/dashboardComponents/loading"
import Error from "../../components/dashboardComponents/error"
import CoinTable from "@/components/dashboardComponents/coinTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react"
import { fetchCoins } from "@/lib/coinRankingApi"
import { useRouter } from "next/navigation"

export default function CoinsPage({ searchParams }) {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const page = Number(searchParams?.page) || 1
  const limitPerPage = 10

  const router = useRouter()

  const loadCoins = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true)
        if (typeof window !== "undefined") {
          localStorage.removeItem("coinrankingData")
          localStorage.removeItem("coinrankingTimestamp")
        }
      } else {
        setLoading(true)
      }

      const data = await fetchCoins()
      setCoins(data)
      setLastUpdated(new Date().toLocaleTimeString())

      if (forceRefresh) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    } catch (err) {
      console.error("Error in component:", err)
      setError(err.message)
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadCoins()
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  if (error) {
    return (
      <Error error={error} loadCoins={loadCoins} />
    )
  }

  const startIndex = (page - 1) * limitPerPage
  const endIndex = startIndex + limitPerPage
  const paginatedCoins = coins.slice(startIndex, endIndex)
  const totalPages = Math.ceil(coins.length / limitPerPage)

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold">Cryptocurrency Market</CardTitle>
              <p className="text-muted-foreground mt-1">Top {coins.length} cryptocurrencies by market cap</p>
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && <span className="text-xs text-muted-foreground">Last updated: {lastUpdated}</span>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadCoins(true)}
                disabled={refreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <CoinTable coins={paginatedCoins} />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, coins.length)} of {coins.length} coins
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => router.push(`/dashboard?page=${page - 1}`)}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }

                  return (
                    <Button
                      key={i}
                      variant={pageNum === page ? "default" : "outline"}
                      size="sm"
                      className="w-9 h-9 p-0"
                      onClick={() => router.push(`/dashboard?page=${pageNum}`)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => router.push(`/dashboard?page=${page + 1}`)}
                className="flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

