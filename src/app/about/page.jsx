import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function About() {
  return (
    <div className="container mx-auto px-2">
        
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">
              About VatCoins
            </h1>
            <p className="text-muted-foreground text-lg">
              VatCoins is your go-to platform for the latest cryptocurrency data.
              We provide real-time, accurate, and comprehensive market insights to
              empower users in the fast-paced world of digital assets.
            </p>
            <p className="text-muted-foreground text-lg">
              Launched in 2025, VatCoins is built to keep you ahead with
              up-to-the-minute data, whether you're tracking prices, analyzing
              trends, or exploring new opportunities in the crypto space.
            </p>
            <Button size="lg">
              <a href="/dashboard">Explore Data</a>
            </Button>
          </div>
          <div className="relative h-96 w-full">
            <Image
              src="/about-vatcoins.jpg"
              alt="VatCoins Data Dashboard"
              fill
              className="object-cover rounded-lg shadow-lg shadow-neutral-950"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why VatCoins?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="shadow-sm shadow-neutral-800 hover:shadow-md hover:scale-102">
            <CardHeader>
              <CardTitle>Real-Time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Stay informed with the freshest cryptocurrency data, updated in
                real time.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm shadow-neutral-800 hover:shadow-md hover:scale-102">
            <CardHeader>
              <CardTitle>Comprehensive Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access detailed market trends and analytics to make informed
                decisions.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm shadow-neutral-800 hover:shadow-md hover:scale-102">
            <CardHeader>
              <CardTitle>Intuitive Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Navigate effortlessly with a user-friendly interface built for all
                levels.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}