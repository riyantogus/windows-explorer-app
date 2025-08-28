import { describe, it, expect } from "bun:test";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { FolderController } from "../src/controllers/folder.controller";
import { FolderService } from "../src/services/folder.service";
import { mockFolders } from "./folder.mock";

// mock service
const serviceMock: Partial<FolderService> = {
  getFullTree: async () => mockFolders,
  getDirectSubfolders: async (folderId: string) =>
    mockFolders.filter((f) => f.parentId === folderId),
  getById: async (id: string) => mockFolders.find((f) => f.id === id) || null,
};

describe("FolderController", () => {
  const controller = new FolderController(serviceMock as FolderService);

  const makeCtx = (id?: string) => {
    const set: any = {};
    return { params: { id }, set } as any;
  };

  describe("getFullTree", () => {
    it("should return 200 and full tree", async () => {
      const ctx = makeCtx();

      const result = await controller.getFullTree(ctx);

      expect(ctx.set.status).toBe(200);
      expect(result).toEqual({ success: true, data: mockFolders });
    });

    it("should return 500 on unexpected error", async () => {
      class ErrorService extends FolderService {
        override getFullTree(): never {
          throw new Error("DB down");
        }
      }
      const errorController = new FolderController(new ErrorService());
      const ctx = makeCtx();

      const result = await errorController.getFullTree(ctx);

      expect(ctx.set.status).toBe(500);
      expect(result).toEqual({
        success: false,
        message: "Internal server error",
      });
    });
  });

  describe("getDirectSubfolders", () => {
    it("should return 200 and subfolders if exist", async () => {
      const parentId = mockFolders[0].id;
      const ctx = makeCtx(parentId);

      const result = await controller.getDirectSubfolders(ctx);

      expect(ctx.set.status).toBe(200);
      expect(result).toEqual({
        success: true,
        data: mockFolders.filter((f) => f.parentId === parentId),
      });
    });

    it("should return 200 and empty array if no subfolders", async () => {
      const ctx = makeCtx(uuidv4());

      const result = await controller.getDirectSubfolders(ctx);

      expect(ctx.set.status).toBe(200);
      expect(result).toEqual({ success: true, data: [] });
    });

    it("should return 400 if folderId is invalid", async () => {
      class InvalidService extends FolderService {
        override getDirectSubfolders(): never {
          throw new ZodError([
            { code: "custom", message: "Invalid id", path: ["id"] },
          ]);
        }
      }
      const invalidController = new FolderController(new InvalidService());
      const ctx = makeCtx("");

      const result = await invalidController.getDirectSubfolders(ctx);

      expect(ctx.set.status).toBe(400);
      expect(result).toEqual({ success: false, message: "Invalid id" });
    });

    it("should return 500 on unexpected error", async () => {
      class ErrorService extends FolderService {
        override getDirectSubfolders(): never {
          throw new Error("DB down");
        }
      }
      const errorController = new FolderController(new ErrorService());
      const ctx = makeCtx(uuidv4());

      const result = await errorController.getDirectSubfolders(ctx);

      expect(ctx.set.status).toBe(500);
      expect(result).toEqual({
        success: false,
        message: "Internal server error",
      });
    });
  });

  describe("getById", () => {
    it("should return 200 and folder if found", async () => {
      const folder = mockFolders[0];
      const ctx = makeCtx(folder.id);

      const result = await controller.getById(ctx);

      expect(ctx.set.status).toBe(200);
      expect(result).toEqual({ success: true, data: folder });
    });

    it("should return 404 if folder not found", async () => {
      const ctx = makeCtx(uuidv4());

      const result = await controller.getById(ctx);

      expect(ctx.set.status).toBe(404);
      expect(result).toEqual({ success: false, message: "Folder not found" });
    });

    it("should return 400 if folderId is invalid", async () => {
      class InvalidService extends FolderService {
        override getById(): never {
          throw new ZodError([
            { code: "custom", message: "Invalid id", path: ["id"] },
          ]);
        }
      }
      const invalidController = new FolderController(new InvalidService());
      const ctx = makeCtx("");

      const result = await invalidController.getById(ctx);

      expect(ctx.set.status).toBe(400);
      expect(result).toEqual({ success: false, message: "Invalid id" });
    });

    it("should return 500 on unexpected error", async () => {
      class ErrorService extends FolderService {
        override getById(): never {
          throw new Error("DB down");
        }
      }
      const errorController = new FolderController(new ErrorService());
      const ctx = makeCtx(uuidv4());

      const result = await errorController.getById(ctx);

      expect(ctx.set.status).toBe(500);
      expect(result).toEqual({
        success: false,
        message: "Internal server error",
      });
    });
  });
});
