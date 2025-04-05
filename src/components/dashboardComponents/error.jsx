import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Error({ error, loadCoins }) {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold">Cryptocurrency Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="mb-4">{error}</p>
              <p className="text-sm mb-4">
                Please check your API key and try again. Make sure your CoinRanking API key has sufficient permissions.
              </p>
              <Button variant="outline" className="bg-white hover:bg-red-50" onClick={() => loadCoins(true)}>
                Try Again
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
