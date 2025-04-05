import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold">Cryptocurrency Market</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
            <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
          </div>
          <h3 className="mt-6 text-xl font-medium">Loading Market Data</h3>
          <p className="text-muted-foreground mt-2">Fetching the latest cryptocurrency prices...</p>
        </CardContent>
      </Card>
    </div>
  )
}