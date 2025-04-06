"use client";

import { useMemo, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CoinTable from "./coinTable";
import { useRouter, useSearchParams } from "next/navigation";

export default function CoinCard({ lastUpdated, coins, loadCoins }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const limitPerPage = 10;

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const page = pageParam ? Number.parseInt(pageParam, 10) : 1;
    setCurrentPage(page);
  }, [searchParams]);

  const { paginatedCoins, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * limitPerPage;
    const endIndex = startIndex + limitPerPage;
    const paginated = coins.slice(startIndex, endIndex);
    const total = Math.ceil(coins.length / limitPerPage);
    return { paginatedCoins: paginated, totalPages: total };
  }, [coins, currentPage, limitPerPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    router.push(`/dashboard?page=${page}`);
  };

  return (
    <Card className="border-none shadow-lg py-2 px-1">
      <CardHeader className="pb-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-bold">Cryptocurrency Market</CardTitle>
            <p className="text-muted-foreground mt-1">
              Top {coins.length} cryptocurrencies by market cap
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">Last updated: {lastUpdated}</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadCoins(true)}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center py-1 px-3 border-b">
          <p className="text-sm text-muted-foreground">Select a coin to see details</p>
        </div>

        <div className="overflow-x-auto">
          <CoinTable coins={paginatedCoins} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * limitPerPage + 1}-
            {Math.min(currentPage * limitPerPage, coins.length)} of {coins.length} coins
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              className="flex items-center justify-center w-9 h-9 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={i}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    className="w-9 h-9 p-0"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center gap-1"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="flex items-center justify-center w-9 h-9 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}