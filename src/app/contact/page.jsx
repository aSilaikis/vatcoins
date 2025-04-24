"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function Contact() {
  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted");
  };

  return (
    <div className="container mx-auto px-2">

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
            <p className="text-muted-foreground text-lg">
              Have questions about VatCoins or need help with our real-time
              cryptocurrency data? Fill out the form below, and you will get response
              back as soon as possible.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your Email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your Message" rows={5} />
              </div>
              <Button onClick={handleContactSubmit} size="lg">
                Send Message
              </Button>
            </div>
          </div>
          <div className="relative h-96 w-full">
            <Image
                src="/contact-2-vatcoins.jpg"
                alt="VatCoins Data Visualization"
                fill
                className="rounded-lg shadow-lg shadow-neutral-950"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative h-80 w-full">
            <Image
              src="/contact-vatcoins.jpg"
              alt="VatCoins Data Visualization"
              fill
              className="rounded-lg shadow-lg shadow-neutral-950"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Explore Real-Time Crypto Data</h2>
            <p className="text-muted-foreground text-lg">
              VatCoins delivers the latest cryptocurrency market insights at your
              fingertips. From price trends to market analytics, our platform
              keeps you informed with up-to-the-minute data.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/dashboard">Discover More</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}