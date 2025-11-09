import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import VerificationBadge from "@/components/VerificationBadge";
import BookingCard from "@/components/BookingCard";
import { Edit, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function WorkerDashboard() {
  const [, setLocation] = useLocation();
  const [isAvailable, setIsAvailable] = useState(true);
  
  const worker = {
    name: "Rajesh Kumar",
    photo: "",
    services: ["Plumber", "Electrician"],
    verificationStatus: "verified" as const,
    totalEarnings: 25000,
    pendingEarnings: 3500,
    completedJobs: 47,
  };

  const bookings = [
    {
      id: "1",
      clientName: "Sharma Family",
      service: "Plumbing Repair",
      date: new Date(2025, 10, 15),
      location: "Sector 21, Noida",
      amount: 500,
      status: "active" as const,
    },
    {
      id: "2",
      clientName: "Gupta Residence",
      service: "Electrical Installation",
      date: new Date(2025, 10, 20),
      location: "Dwarka, New Delhi",
      amount: 800,
      status: "pending" as const,
    },
    {
      id: "3",
      clientName: "Mehta House",
      service: "Pipe Fitting",
      date: new Date(2025, 10, 10),
      location: "Gurgaon",
      amount: 600,
      status: "completed" as const,
    },
  ];

  const handleMarkComplete = (id: string) => {
    console.log(`Marking booking ${id} as complete`);
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={worker.photo} />
                  <AvatarFallback className="text-2xl">RK</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold" data-testid="text-worker-name">{worker.name}</h2>
                    <VerificationBadge status={worker.verificationStatus} />
                  </div>
                  <p className="text-muted-foreground mb-3">{worker.services.join(", ")}</p>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="availability"
                        checked={isAvailable}
                        onCheckedChange={setIsAvailable}
                        data-testid="switch-availability"
                      />
                      <Label htmlFor="availability" className="cursor-pointer">
                        {isAvailable ? "Available" : "Busy"}
                      </Label>
                    </div>
                    
                    <Button variant="outline" size="sm" data-testid="button-edit-profile">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div>
              <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    {...booking}
                    onMarkComplete={handleMarkComplete}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Earnings Overview</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-total-earnings">₹{worker.totalEarnings}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-semibold" data-testid="text-pending-earnings">₹{worker.pendingEarnings}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Jobs</p>
                  <p className="text-2xl font-semibold" data-testid="text-completed-jobs">{worker.completedJobs}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Verification Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Police Verification</span>
                  <VerificationBadge status={worker.verificationStatus} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your police verification has been approved. You can now receive bookings.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
