import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Reset database
  await prisma.file.deleteMany();
  await prisma.folder.deleteMany();

  // Root Rumah Sakit
  const rumahSakit = await prisma.folder.create({
    data: { name: "Rumah Sakit" },
  });

  // Umum
  const umum = await prisma.folder.create({
    data: { name: "Umum", parentId: rumahSakit.id },
  });

  const [rsudKota, rsudKabupaten, rsSwastaUmum] = await prisma.$transaction([
    prisma.folder.create({ data: { name: "RSUD Kota", parentId: umum.id } }),
    prisma.folder.create({
      data: { name: "RSUD Kabupaten", parentId: umum.id },
    }),
    prisma.folder.create({
      data: { name: "RS Swasta Umum", parentId: umum.id },
    }),
  ]);

  // Tambahkan file di RSUD Kota
  await prisma.file.createMany({
    data: [
      { name: "Laporan Tahunan.pdf", folderId: rsudKota.id },
      { name: "Daftar Dokter.xlsx", folderId: rsudKota.id },
    ],
  });

  // Spesialis
  const spesialis = await prisma.folder.create({
    data: { name: "Spesialis", parentId: rumahSakit.id },
  });

  const [jantung, anak, bedah, mata] = await prisma.$transaction([
    prisma.folder.create({ data: { name: "Jantung", parentId: spesialis.id } }),
    prisma.folder.create({ data: { name: "Anak", parentId: spesialis.id } }),
    prisma.folder.create({ data: { name: "Bedah", parentId: spesialis.id } }),
    prisma.folder.create({ data: { name: "Mata", parentId: spesialis.id } }),
  ]);

  // Tambahkan file di Spesialis Anak
  await prisma.file.create({
    data: { name: "Panduan Imunisasi.docx", folderId: anak.id },
  });

  // Klinik
  const klinik = await prisma.folder.create({
    data: { name: "Klinik", parentId: rumahSakit.id },
  });

  const [klinikGigi, klinikKulit, klinikTumbuh] = await prisma.$transaction([
    prisma.folder.create({
      data: { name: "Klinik Gigi", parentId: klinik.id },
    }),
    prisma.folder.create({
      data: { name: "Klinik Kulit", parentId: klinik.id },
    }),
    prisma.folder.create({
      data: { name: "Klinik Tumbuh Kembang", parentId: klinik.id },
    }),
  ]);

  // Tambahkan file di Klinik Gigi
  await prisma.file.createMany({
    data: [
      { name: "Jadwal Dokter.pdf", folderId: klinikGigi.id },
      { name: "Daftar Pasien.csv", folderId: klinikGigi.id },
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
