import WorkerCard from "../WorkerCard";

export default function WorkerCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      <WorkerCard
        id="1"
        name="Rajesh Kumar"
        services={["Plumber", "Electrician"]}
        hourlyRate={250}
        isAvailable={true}
        verificationStatus="verified"
        onHire={(id) => console.log(`Hire worker ${id}`)}
      />
      <WorkerCard
        id="2"
        name="Priya Sharma"
        services={["House Cleaning"]}
        hourlyRate={200}
        isAvailable={false}
        verificationStatus="verified"
        onHire={(id) => console.log(`Hire worker ${id}`)}
      />
      <WorkerCard
        id="3"
        name="Amit Singh"
        services={["Carpenter"]}
        hourlyRate={300}
        isAvailable={true}
        verificationStatus="pending"
        onHire={(id) => console.log(`Hire worker ${id}`)}
      />
    </div>
  );
}
