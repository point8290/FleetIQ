const { MongoClient } = require("mongodb");
const faker = require("faker");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db("fleetiq");

    // Vehicles
    const vehicles = Array.from({ length: 100 }).map(() => ({
      vehicleId: faker.vehicle.vin(),
      region: faker.address.state(),
      status: faker.random.arrayElement(["idle", "on_trip", "maintenance"]),
    }));

    await db.collection("vehicles").insertMany(vehicles);

    // Telemetry (time-series data)
    const telemetry = [];
    const now = new Date();

    for (let i = 0; i < 1000; i++) {
      telemetry.push({
        ts: new Date(now.getTime() - i * 60000),
        vehicle: {
          id: vehicles[i % 100].vehicleId,
          region: vehicles[i % 100].region,
        },
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        speed: faker.datatype.number({ min: 0, max: 120 }),
      });
    }

    await db.collection("telemetry").insertMany(telemetry);
    console.log("✅ Seeded successfully");
  } finally {
    await client.close();
  }
}

seed();
