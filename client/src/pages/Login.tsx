import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Briefcase, Home } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || "worker";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocationInput] = useState("");
  const [services, setServices] = useState("");
  const [policeVerification, setPoliceVerification] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempted", { role, email, password, contact, location, services, policeVerification });
    
    if (role === "worker") {
      setLocation("/worker-dashboard");
    } else if (role === "household") {
      setLocation("/household-dashboard");
    }
  };

  const isWorker = role === "worker";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <Badge className="gap-2 px-4 py-2" data-testid="badge-role">
            {isWorker ? <Briefcase className="h-4 w-4" /> : <Home className="h-4 w-4" />}
            <span>{isWorker ? "Worker" : "Household"} Login</span>
          </Badge>
        </div>

        <h1 className="font-display text-3xl font-semibold text-center mb-8" data-testid="text-title">
          Welcome to RozKaam
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="input-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              type="tel"
              placeholder="+91 98765 43210"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              data-testid="input-contact"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location / Pincode</Label>
            <Input
              id="location"
              placeholder="e.g., 110001, New Delhi"
              value={location}
              onChange={(e) => setLocationInput(e.target.value)}
              data-testid="input-location"
            />
          </div>

          {isWorker && (
            <>
              <div className="space-y-2">
                <Label htmlFor="services">Services You Provide</Label>
                <Input
                  id="services"
                  placeholder="e.g., Plumber, Electrician"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  data-testid="input-services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="police-verification">Police Verification Number *</Label>
                <Input
                  id="police-verification"
                  placeholder="e.g., PV123456789"
                  value={policeVerification}
                  onChange={(e) => setPoliceVerification(e.target.value)}
                  required={isWorker}
                  data-testid="input-police-verification"
                />
                <p className="text-xs text-muted-foreground">
                  Mandatory for all workers. Your verification will be reviewed by admin.
                </p>
              </div>
            </>
          )}

          <Button type="submit" className="w-full" data-testid="button-login">
            Login / Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setLocation("/")}
            className="text-sm text-primary hover:underline"
            data-testid="button-back"
          >
            Back to Home
          </button>
        </div>
      </Card>
    </div>
  );
}
