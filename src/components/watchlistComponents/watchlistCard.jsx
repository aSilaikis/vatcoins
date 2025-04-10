import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { SaveOff, TrendingUp, TrendingDown } from "lucide-react";
import SparklineChart from "../descriptionComponents/sparklineChart";

export default function WatchlistCard( { coin, removeFromWatchlistHandler } ) {
  return (
    <Card
      key={coin.uuid}
      className="shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={coin.iconUrl}
            alt={`${coin.name} icon`}
            className="w-10 h-10 rounded-full"
          />
          <CardTitle className="text-xl">{coin.name}</CardTitle>
        </div>
        <Button
          onClick={() => removeFromWatchlistHandler(coin.uuid)}
        >
          <SaveOff className="h-12 w-12" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-xl font-semibold">
            ${Number(coin.price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </p>
          <div className="flex items-center gap-2">
            {Number(coin.change) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm ${
                Number(coin.change) >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {Math.abs(coin.change)}% (24h)
            </span>
          </div>
          <p className="text-sm">
            Market Cap: $
            {Number(coin.marketCap).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
          <SparklineChart coinDetails={coin} />
        </div>
      </CardContent>
    </Card>
  );
};