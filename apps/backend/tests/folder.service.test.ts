import { describe, it, expect } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import { FolderService } from "../src/services/folder.service";
import { FolderRepository } from "../src/repositories/folder.repository";
import { buildTree } from "../src/utils/tree";
import { mockFolders } from "./folder.mock";

// mock repository
const repoMock: Partial<FolderRepository> = {
  findAll: async () => mockFolders,
  findDirectChildren: async (folderId: string) =>
    mockFolders.filter((f) => f.parentId === folderId),
  findById: async (id: string) => mockFolders.find((f) => f.id === id) || null,
};

describe("FolderService", () => {
  const service = new FolderService(repoMock as FolderRepository);

  // folder root (tidak punya parent)
  const parentId = mockFolders.find((f) => f.parentId === null)?.id as string;

  // folder leaf (tidak punya child)
  const leafId = mockFolders.find(
    (f) => !mockFolders.some((c) => c.parentId === f.id),
  )?.id as string;

  describe("getFullTree", () => {
    it("should return folder tree", async () => {
      const result = await service.getFullTree();
      expect(result).toEqual(buildTree(mockFolders));
    });
  });

  describe("getDirectSubfolders", () => {
    it("should return children for folder", async () => {
      const result = await service.getDirectSubfolders(parentId);
      expect(result).toEqual(
        mockFolders.filter((f) => f.parentId === parentId),
      );
    });

    it("should return empty array if no children", async () => {
      const result = await service.getDirectSubfolders(leafId);
      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return folder if exists", async () => {
      const result = await service.getById(parentId);
      expect(result).toEqual(
        mockFolders.find((f) => f.id === parentId) ?? null,
      );
    });

    it("should return null if not exists", async () => {
      const result = await service.getById(uuidv4());
      expect(result).toBeNull();
    });

    it("should throw if id invalid", async () => {
      expect(service.getById("")).rejects.toThrow();
    });
  });
});
