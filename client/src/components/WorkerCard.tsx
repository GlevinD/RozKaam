import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VerificationBadge from "./VerificationBadge";

interface WorkerCardProps {
  id: string;
  name: string;
  photo?: string;
  services: string[];
  hourlyRate: number;
  isAvailable: boolean;
  verificationStatus: "verified" | "pending" | "rejected";
  onHire?: (id: string) => void;
}

export default function WorkerCard({
  id,
  name,
  photo,
  services,
  hourlyRate,
  isAvailable,
  verificationStatus,
  onHire,
}: WorkerCardProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <Card className="p-6 hover-elevate" data-testid={`card-worker-${id}`}>
      <div className="flex flex-col items-center text-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={photo} alt={name} />
          <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-center gap-2">
            <h3 className="font-semibold text-lg" data-testid={`text-worker-name-${id}`}>{name}</h3>
            <VerificationBadge status={verificationStatus} size="sm" />
          </div>
          
          <div className="flex flex-wrap gap-1 justify-center">
            {services.map((service) => (
              <Badge key={service} variant="secondary" className="text-xs" data-testid={`badge-service-${id}`}>
                {service}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold text-primary" data-testid={`text-rate-${id}`}>₹{hourlyRate}</p>
            <span className="text-sm text-muted-foreground">/hour</span>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className={`text-sm ${isAvailable ? 'text-green-600' : 'text-muted-foreground'}`} data-testid={`text-availability-${id}`}>
              {isAvailable ? "Available Now" : "Busy"}
            </span>
          </div>
        </div>
        
        <Button
          className="w-full"
          disabled={!isAvailable || verificationStatus !== "verified"}
          onClick={() => onHire?.(id)}
          data-testid={`button-hire-${id}`}
        >
          Hire Now
        </Button>
      </div>
    </Card>
  );
}
