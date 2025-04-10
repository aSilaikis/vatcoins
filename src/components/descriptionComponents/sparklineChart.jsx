import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

export default function SparklineChart({ coinDetails }) {
  const now = new Date();
  const sparklineTimestamps = Array.from({ length: 24 }, (_, i) => {
    const date = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    return date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      hour12: false, 
      minute: "numeric" 
    });
  });

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
  };

  const formatTooltipValue = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const chartData = coinDetails.sparkline?.map((price, index) => ({
    time: formatTimestamp(sparklineTimestamps[index]),
    price: parseFloat(price),
  })) || [];

  const prices = chartData.map((entry) => entry.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const yAxisDomain = [
    minPrice - priceRange * 0.1,
    maxPrice + priceRange * 0.1,
  ];

  const chartColor = coinDetails.change >= 0 ? "hsl(120, 60%, 50%)" : "hsl(0, 60%, 50%)";

  const gradientId = `fillPrice-${coinDetails.uuid}`;

  const chartSparklineConfig = {
    price: {
      label: "Price",
      color: chartColor,
    },
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold mb-2">Sparkline</h3>
      <ChartContainer config={chartSparklineConfig} className="w-full h-[200px]">
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={yAxisDomain} />
          <Tooltip
            formatter={(value) => [formatTooltipValue(value), "Price"]}
            labelFormatter={() => `Coin: ${coinDetails.name}`}
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
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}