import { describe, it, expect, beforeEach } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import { mockFolders } from "./folder.mock";
import { FolderRepository } from "../src/repositories/folder.repository";

describe("FolderRepository", () => {
  let repo: FolderRepository;
  let mockPrisma: any;

  beforeEach(() => {
    // mock prisma
    mockPrisma = {
      folder: {
        findMany: async ({ where, orderBy }: any) => {
          let result = mockFolders;
          if (where?.parentId) {
            result = result.filter((f) => f.parentId === where.parentId);
          }
          if (orderBy?.name === "asc") {
            result = result.sort((a, b) => a.name.localeCompare(b.name));
          }
          return result;
        },
        findUnique: async ({ where }: any) => {
          return mockFolders.find((f) => f.id === where.id) || null;
        },
      },
    };

    // inject mock prisma
    repo = new FolderRepository(mockPrisma);
  });

  describe("findAll", () => {
    it("should return all folders sorted by name", async () => {
      const result = await repo.findAll();
      const sorted = [...mockFolders].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      expect(result).toEqual(sorted);
    });
  });

  describe("findDirectChildren", () => {
    it("should return direct children of a given parent id sorted by name", async () => {
      const parentId = mockFolders[0].id;
      const result = await repo.findDirectChildren(parentId);
      const expected = mockFolders
        .filter((f) => f.parentId === parentId)
        .sort((a, b) => a.name.localeCompare(b.name));
      expect(result).toEqual(expected);
    });

    it("should return empty array if parent has no children", async () => {
      const parentId = uuidv4();
      const result = await repo.findDirectChildren(parentId);
      expect(result).toEqual([]);
    });
  });

  describe("findById", () => {
    it("should return folder if id exists", async () => {
      const folder = mockFolders[0];
      const result = await repo.findById(folder.id);
      expect(result).toEqual(folder);
    });

    it("should return null if id does not exist", async () => {
      const nonExistentId = uuidv4();
      const result = await repo.findById(nonExistentId);
      expect(result).toBeNull();
    });

    it("should return null for any random id not found", async () => {
      const randomId = uuidv4();
      const result = await repo.findById(randomId);
      expect(result).toBeNull();
    });
  });
});
