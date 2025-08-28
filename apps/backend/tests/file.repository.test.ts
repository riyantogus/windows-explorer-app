import { describe, it, expect, beforeEach } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import { FileRepository } from "../src/repositories/file.repository";
import { mockFiles } from "./file.mock";

describe("FileRepository", () => {
  let repo: FileRepository;
  let mockPrisma: any;

  beforeEach(() => {
    // mock prisma
    mockPrisma = {
      file: {
        findMany: async ({ where, orderBy }: any) => {
          let result = mockFiles;
          if (where?.folderId) {
            result = result.filter((f) => f.folderId === where.folderId);
          }
          if (orderBy?.name === "asc") {
            result = result.sort((a, b) => a.name.localeCompare(b.name));
          }
          return result;
        },
      },
    };

    // inject mock prisma
    repo = new FileRepository(mockPrisma);
  });

  describe("FileRepository", () => {
    it("should return all files for a given folder id sorted by name", async () => {
      const folderId = "8fa85f64-5717-4562-b3fc-2c963f66afa6"; // RSUD Kota
      const result = await repo.getFilesByFolder(folderId);
      const expected = mockFiles
        .filter((f) => f.folderId === folderId)
        .sort((a, b) => a.name.localeCompare(b.name));

      expect(result).toEqual(expected);
    });

    it("should return empty array if folder has no files", async () => {
      const folderId = uuidv4();
      const result = await repo.getFilesByFolder(folderId);
      expect(result).toEqual([]);
    });

    it("should return empty array for any random folder id not found", async () => {
      const folderId = uuidv4();
      const result = await repo.getFilesByFolder(folderId);
      expect(result).toEqual([]);
    });
  });
});
