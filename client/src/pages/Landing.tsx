import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Shield, DollarSign, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Local_workers_serving_households_96744d52.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      <div
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
            RozKaam
          </h1>
          <p className="font-display text-2xl md:text-3xl text-white mb-4">
            Verified Workers, Trusted Households
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Connecting local communities with verified service professionals. Simple, trusted, and local.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary/90 backdrop-blur-sm hover:bg-primary"
              onClick={() => setLocation("/login?role=worker")}
              data-testid="button-login-worker"
            >
              Login as Worker
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
              onClick={() => setLocation("/login?role=household")}
              data-testid="button-login-household"
            >
              Login as Household
            </Button>
          </div>
        </div>
      </div>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Police Verified Workers</h3>
              <p className="text-muted-foreground">
                Every worker goes through mandatory police verification for your safety and peace of mind.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">5% Simple Commission</h3>
              <p className="text-muted-foreground">
                Transparent pricing with only a 5% platform fee. Workers keep 95% of their earnings.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Local & Trusted</h3>
              <p className="text-muted-foreground">
                Find verified service professionals in your local area for quick and reliable service.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl font-semibold text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h3 className="font-display text-2xl font-semibold mb-6">For Workers</h3>
              {[
                { step: 1, title: "Register & Verify", desc: "Sign up and submit your police verification details" },
                { step: 2, title: "Get Approved", desc: "Admin reviews and approves your verification" },
                { step: 3, title: "Set Availability", desc: "Toggle your availability when you're ready to work" },
                { step: 4, title: "Receive Bookings", desc: "Get hired by households and complete jobs" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {step}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <h3 className="font-display text-2xl font-semibold mb-6">For Households</h3>
              {[
                { step: 1, title: "Sign Up", desc: "Create your household account in minutes" },
                { step: 2, title: "Search Workers", desc: "Browse verified workers by service type and location" },
                { step: 3, title: "Hire Instantly", desc: "Book available workers with one click" },
                { step: 4, title: "Rate & Review", desc: "Complete payment and share your experience" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {step}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
