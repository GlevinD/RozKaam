import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import VerificationBadge from "@/components/VerificationBadge";
import { CheckCircle2, XCircle, LogOut, DollarSign, Users, Briefcase } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const workers = [
    {
      id: "1",
      name: "Rajesh Kumar",
      service: "Plumber, Electrician",
      verificationStatus: "verified" as const,
      policeVerification: "PV123456789",
    },
    {
      id: "2",
      name: "Amit Singh",
      service: "Carpenter",
      verificationStatus: "pending" as const,
      policeVerification: "PV987654321",
    },
    {
      id: "3",
      name: "Sunita Devi",
      service: "Cook",
      verificationStatus: "rejected" as const,
      policeVerification: "PV456789123",
    },
  ];

  const bookings = [
    {
      id: "1",
      worker: "Rajesh Kumar",
      client: "Sharma Family",
      service: "Plumbing",
      amount: 500,
      status: "completed" as const,
      date: "2025-11-10",
    },
    {
      id: "2",
      worker: "Priya Sharma",
      client: "Gupta Residence",
      service: "Cleaning",
      amount: 800,
      status: "active" as const,
      date: "2025-11-12",
    },
  ];

  const stats = {
    totalCommission: 12500,
    thisMonth: 3400,
    totalWorkers: 156,
    activeBookings: 28,
  };

  const handleApprove = (id: string) => {
    console.log(`Approving worker ${id}`);
  };

  const handleReject = (id: string) => {
    console.log(`Rejecting worker ${id}`);
  };

  const handleLogout = () => {
    console.log("Logging out");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold">RozKaam Admin</h1>
          <Button variant="ghost" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-semibold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage workers, bookings, and monitor platform earnings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Total Commission</p>
            <p className="text-3xl font-bold" data-testid="text-total-commission">₹{stats.totalCommission}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-3xl font-bold" data-testid="text-month-commission">₹{stats.thisMonth}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground">Total Workers</p>
            <p className="text-3xl font-bold" data-testid="text-total-workers">{stats.totalWorkers}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-sm text-muted-foreground">Active Bookings</p>
            <p className="text-3xl font-bold" data-testid="text-active-bookings">{stats.activeBookings}</p>
          </Card>
        </div>

        <Tabs defaultValue="workers" className="space-y-6">
          <TabsList data-testid="tabs-admin">
            <TabsTrigger value="workers" data-testid="tab-workers">Workers</TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">Bookings</TabsTrigger>
            <TabsTrigger value="earnings" data-testid="tab-earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="workers">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Police Verification</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((worker) => (
                    <TableRow key={worker.id} data-testid={`row-worker-${worker.id}`}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>{worker.service}</TableCell>
                      <TableCell className="font-mono text-sm">{worker.policeVerification}</TableCell>
                      <TableCell>
                        <VerificationBadge status={worker.verificationStatus} size="sm" />
                      </TableCell>
                      <TableCell>
                        {worker.verificationStatus === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(worker.id)}
                              data-testid={`button-approve-${worker.id}`}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(worker.id)}
                              data-testid={`button-reject-${worker.id}`}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} data-testid={`row-booking-${booking.id}`}>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>{booking.worker}</TableCell>
                      <TableCell>{booking.client}</TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell className="font-semibold">₹{booking.amount}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            booking.status === "completed"
                              ? "bg-green-500 text-white"
                              : "bg-blue-500 text-white"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Commission Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-muted-foreground">Total Transactions</span>
                  <span className="font-semibold">250</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-muted-foreground">Total Platform Earnings (5%)</span>
                  <span className="font-semibold text-primary">₹{stats.totalCommission}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-muted-foreground">Worker Earnings (95%)</span>
                  <span className="font-semibold">₹{stats.totalCommission * 19}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Month Commission</span>
                  <span className="font-semibold text-green-600">₹{stats.thisMonth}</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
