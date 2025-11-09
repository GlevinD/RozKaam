import BookingCard from "../BookingCard";

export default function BookingCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 max-w-4xl">
      <BookingCard
        id="1"
        clientName="Sharma Family"
        service="Plumbing Repair"
        date={new Date(2025, 10, 15)}
        location="Sector 21, Noida"
        amount={500}
        status="active"
        onMarkComplete={(id) => console.log(`Mark complete: ${id}`)}
      />
      <BookingCard
        id="2"
        clientName="Gupta Residence"
        service="House Cleaning"
        date={new Date(2025, 10, 20)}
        location="Dwarka, New Delhi"
        amount={800}
        status="pending"
      />
    </div>
  );
}
