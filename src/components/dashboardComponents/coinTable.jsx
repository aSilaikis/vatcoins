import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function CoinTable({ coins }) {
  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[80px] font-medium">Rank</TableHead>
          <TableHead className="font-medium">Name</TableHead>
          <TableHead className="font-medium">Symbol</TableHead>
          <TableHead className="text-right font-medium">Price (USD)</TableHead>
          <TableHead className="text-right font-medium">Market Cap</TableHead>
          <TableHead className="text-right font-medium">24h Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coins.map((coin) => (
          <TableRow key={coin.uuid} className="hover:bg-muted/30 transition-colors">
            <TableCell className="font-medium">
              <Badge variant="outline" className="bg-muted/50">
                {coin.rank}
              </Badge>
            </TableCell>
            <TableCell>
              <Link
                href={`/dashboard/${coin.uuid}`}
                className="flex items-center gap-3 hover:underline cursor-pointer"
              >
                {coin.iconUrl && (
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                    <img
                      src={coin.iconUrl}
                      alt={`${coin.name} icon`}
                      className="w-full h-full object-fill"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}
                <div>
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-xs text-muted-foreground">Rank #{coin.rank}</div>
                </div>
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="font-mono">
                {coin.symbol}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-mono">
              $
              {Number.parseFloat(coin.price) < 0.01
                ? Number.parseFloat(coin.price).toFixed(6)
                : Number.parseFloat(coin.price).toFixed(2)}
            </TableCell>
            <TableCell className="text-right font-mono">${Number.parseInt(coin.marketCap)}</TableCell>
            <TableCell className="text-right">
              <div
                className={`flex items-center justify-end gap-1 font-medium
                ${Number.parseFloat(coin.change) >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {Number.parseFloat(coin.change) >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {coin.change}%
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}