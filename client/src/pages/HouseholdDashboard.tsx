import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WorkerCard from "@/components/WorkerCard";
import { Search, LogOut, Filter } from "lucide-react";
import { useLocation } from "wouter";

export default function HouseholdDashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const workers = [
    {
      id: "1",
      name: "Rajesh Kumar",
      photo: "",
      services: ["Plumber", "Electrician"],
      hourlyRate: 250,
      isAvailable: true,
      verificationStatus: "verified" as const,
    },
    {
      id: "2",
      name: "Priya Sharma",
      photo: "",
      services: ["House Cleaning"],
      hourlyRate: 200,
      isAvailable: true,
      verificationStatus: "verified" as const,
    },
    {
      id: "3",
      name: "Amit Singh",
      photo: "",
      services: ["Carpenter"],
      hourlyRate: 300,
      isAvailable: false,
      verificationStatus: "verified" as const,
    },
    {
      id: "4",
      name: "Sunita Devi",
      photo: "",
      services: ["Cook"],
      hourlyRate: 180,
      isAvailable: true,
      verificationStatus: "verified" as const,
    },
    {
      id: "5",
      name: "Mohammed Ali",
      photo: "",
      services: ["Painter"],
      hourlyRate: 220,
      isAvailable: true,
      verificationStatus: "verified" as const,
    },
    {
      id: "6",
      name: "Geeta Patel",
      photo: "",
      services: ["Gardener"],
      hourlyRate: 150,
      isAvailable: true,
      verificationStatus: "verified" as const,
    },
  ];

  const handleHire = (id: string) => {
    console.log(`Hiring worker ${id}`);
  };

  const handleLogout = () => {
    console.log("Logging out");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold">RozKaam</h1>
          <Button variant="ghost" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-semibold mb-2">Find Verified Workers</h2>
          <p className="text-muted-foreground">Browse and hire trusted service professionals in your area</p>
        </div>

        <Card className="p-6 mb-8 sticky top-4 z-10 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger data-testid="select-service">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="plumber">Plumber</SelectItem>
                <SelectItem value="electrician">Electrician</SelectItem>
                <SelectItem value="cleaner">House Cleaning</SelectItem>
                <SelectItem value="carpenter">Carpenter</SelectItem>
                <SelectItem value="cook">Cook</SelectItem>
                <SelectItem value="painter">Painter</SelectItem>
                <SelectItem value="gardener">Gardener</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Location / Pincode"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              data-testid="input-location"
            />

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger data-testid="select-price">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-150">₹0 - ₹150</SelectItem>
                <SelectItem value="150-250">₹150 - ₹250</SelectItem>
                <SelectItem value="250-350">₹250 - ₹350</SelectItem>
                <SelectItem value="350+">₹350+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground" data-testid="text-results">
              Showing {workers.length} verified workers
            </p>
            <Button variant="outline" size="sm" data-testid="button-clear-filters">
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} {...worker} onHire={handleHire} />
          ))}
        </div>
      </div>
    </div>
  );
}
