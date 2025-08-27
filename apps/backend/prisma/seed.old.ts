import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Reset database
  await prisma.folder.deleteMany();

  // Root Rumah Sakit
  const rumahSakit = await prisma.folder.create({
    data: { name: "Rumah Sakit" },
  });

  // Umum
  const umum = await prisma.folder.create({
    data: { name: "Umum", parentId: rumahSakit.id },
  });

  await prisma.folder.createMany({
    data: [
      { name: "RSUD Kota", parentId: umum.id },
      { name: "RSUD Kabupaten", parentId: umum.id },
      { name: "RS Swasta Umum", parentId: umum.id },
    ],
  });

  // Spesialis
  const spesialis = await prisma.folder.create({
    data: { name: "Spesialis", parentId: rumahSakit.id },
  });

  await prisma.folder.createMany({
    data: [
      { name: "Jantung", parentId: spesialis.id },
      { name: "Anak", parentId: spesialis.id },
      { name: "Bedah", parentId: spesialis.id },
      { name: "Mata", parentId: spesialis.id },
    ],
  });

  // Klinik
  const klinik = await prisma.folder.create({
    data: { name: "Klinik", parentId: rumahSakit.id },
  });

  await prisma.folder.createMany({
    data: [
      { name: "Klinik Gigi", parentId: klinik.id },
      { name: "Klinik Kulit", parentId: klinik.id },
      { name: "Klinik Tumbuh Kembang", parentId: klinik.id },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
