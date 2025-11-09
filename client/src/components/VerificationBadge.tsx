import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type VerificationStatus = "verified" | "pending" | "rejected";

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "default";
}

export default function VerificationBadge({ status, size = "default" }: VerificationBadgeProps) {
  const config = {
    verified: {
      icon: CheckCircle2,
      label: "Verified",
      className: "bg-green-500 text-white hover:bg-green-600",
    },
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-yellow-500 text-white hover:bg-yellow-600",
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      className: "bg-red-500 text-white hover:bg-red-600",
    },
  };

  const { icon: Icon, label, className } = config[status];
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <Badge className={`${className} gap-1`} data-testid={`badge-verification-${status}`}>
      <Icon className={iconSize} />
      <span>{label}</span>
    </Badge>
  );
}
