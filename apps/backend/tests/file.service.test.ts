import { describe, it, expect } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import { FileRepository } from "../src/repositories/file.repository";
import { mockFiles } from "./file.mock";
import { FileService } from "../src/services/file.service";

describe("FileService", () => {
  // mock manual
  const repoMock: FileRepository = {
    getFilesByFolder: async (folderId: string) =>
      mockFiles.filter((f) => f.folderId === folderId),
  } as FileRepository;

  const service = new FileService(repoMock);

  describe("getFilesByFolder", () => {
    it("should return files for a folder", async () => {
      const folderId = mockFiles[0].folderId;
      const result = await service.getFilesByFolder(folderId);
      expect(result).toEqual(mockFiles.filter((f) => f.folderId === folderId));
    });

    it("should return empty array if folder has no files", async () => {
      const folderId = uuidv4();
      const result = await service.getFilesByFolder(folderId);
      expect(result).toEqual([]);
    });

    it("should throw if folderId is invalid", async () => {
      expect(service.getFilesByFolder("")).rejects.toThrow();
    });
  });
});
