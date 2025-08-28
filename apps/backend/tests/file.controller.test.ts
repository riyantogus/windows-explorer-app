import { describe, it, expect } from "bun:test";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { FileController } from "../src/controllers/file.controller";
import { FileService } from "../src/services/file.service";
import { mockFiles } from "./file.mock";

// mock service
const serviceMock: Partial<FileService> = {
  getFilesByFolder: async (folderId: string) =>
    mockFiles.filter((f) => f.folderId === folderId),
};

describe("FileController", () => {
  const controller = new FileController(serviceMock as FileService);

  const makeCtx = (id: string) => {
    const set: any = {};
    return { params: { id }, set } as any;
  };

  describe("getFilesByFolder", () => {
    it("should return 200 and files if folder has files", async () => {
      const folderId = mockFiles[0].folderId;
      const ctx = makeCtx(folderId);

      const result = await controller.getFilesByFolder(ctx);

      expect(ctx.set.status).toBe(200);
      expect(result).toEqual({
        success: true,
        data: mockFiles.filter((f) => f.folderId === folderId),
      });
    });

    it("should return 200 and empty array if folder has no files", async () => {
      const folderId = uuidv4();
      const ctx = makeCtx(folderId);

      const result = await controller.getFilesByFolder(ctx);

      expect(ctx.set.status).toBe(200);
      expect(result).toEqual({ success: true, data: [] });
    });

    it("should return 400 if folderId is invalid", async () => {
      // override service to throw ZodError
      class InvalidService extends FileService {
        getFilesByFolder(): never {
          throw new ZodError([
            { code: "custom", message: "Invalid id", path: ["id"] },
          ]);
        }
      }
      const invalidService = new InvalidService();

      const controllerInvalid = new FileController(invalidService);
      const ctx = makeCtx("");

      const result = await controllerInvalid.getFilesByFolder(ctx);

      expect(ctx.set.status).toBe(400);
      expect(result).toEqual({ success: false, message: "Invalid id" });
    });

    it("should return 500 on unexpected error", async () => {
      // override service to throw generic error
      class ErrorService extends FileService {
        getFilesByFolder(): never {
          throw new Error("DB down");
        }
      }
      const errorService = new ErrorService();

      const controllerError = new FileController(errorService);
      const ctx = makeCtx(uuidv4());

      const result = await controllerError.getFilesByFolder(ctx);

      expect(ctx.set.status).toBe(500);
      expect(result).toEqual({
        success: false,
        message: "Internal server error",
      });
    });
  });
});
