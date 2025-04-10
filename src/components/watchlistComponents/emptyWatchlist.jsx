import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function EmptyWatchlist() {
	return (
		<Card className="text-center py-10 w-full mx-auto shadow-lg hover:shadow-xl transition-shadow duration-200">
			<CardHeader className="mb-4">
				<CardTitle className="text-2xl">No Coins in Watchlist</CardTitle>
			</CardHeader>
			<CardContent className="mb-4">

				<p className="text-xl">Your watchlist is empty</p>
				<p className="text-m">
					Add some coins to your watchlist to see them here!
				</p>
			</CardContent>
			<Button
				className="flex w-80 mt-3 h-11 content-center mx-auto" 
				onClick={() => window.location.href = "/dashboard"}
			>
				Go to Dashboard
			</Button>
		</Card>
	);
}
