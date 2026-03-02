import { seedAllDummyData } from "../server/seed";

async function run() {
  await seedAllDummyData();
  console.log("Dummy data seeded successfully.");
  process.exit(0);
}

run().catch((error) => {
  console.error("Seeding failed", error);
  process.exit(1);
});
