import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User } from "lucide-react";
import { format } from "date-fns";

interface BookingCardProps {
  id: string;
  clientName: string;
  service: string;
  date: Date;
  location: string;
  amount: number;
  status: "pending" | "active" | "completed";
  onMarkComplete?: (id: string) => void;
}

export default function BookingCard({
  id,
  clientName,
  service,
  date,
  location,
  amount,
  status,
  onMarkComplete,
}: BookingCardProps) {
  const statusConfig = {
    pending: { label: "Pending", className: "bg-yellow-500 text-white" },
    active: { label: "Active", className: "bg-blue-500 text-white" },
    completed: { label: "Completed", className: "bg-green-500 text-white" },
  };

  return (
    <Card className="p-4" data-testid={`card-booking-${id}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold" data-testid={`text-service-${id}`}>{service}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span data-testid={`text-client-${id}`}>{clientName}</span>
            </div>
          </div>
          <Badge className={statusConfig[status].className} data-testid={`badge-status-${id}`}>
            {statusConfig[status].label}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span data-testid={`text-date-${id}`}>{format(date, "PPP")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span data-testid={`text-location-${id}`}>{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <p className="text-xl font-bold text-primary" data-testid={`text-amount-${id}`}>₹{amount}</p>
          {status === "active" && (
            <Button
              size="sm"
              onClick={() => onMarkComplete?.(id)}
              data-testid={`button-complete-${id}`}
            >
              Mark Complete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
