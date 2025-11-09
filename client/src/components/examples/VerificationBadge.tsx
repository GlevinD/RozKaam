import VerificationBadge from "../VerificationBadge";

export default function VerificationBadgeExample() {
  return (
    <div className="flex gap-4 p-8">
      <VerificationBadge status="verified" />
      <VerificationBadge status="pending" />
      <VerificationBadge status="rejected" />
    </div>
  );
}
