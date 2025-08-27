import { ZodError } from "zod";
import { FolderService } from "../services/folder.service";
import type { Context } from "elysia";

export class FolderController {
  constructor(private readonly service = new FolderService()) {}

  getFullTree = async ({ set }: Context) => {
    try {
      const data = await this.service.getFullTree();
      set.status = 200;
      return { success: true, data };
    } catch (error) {
      set.status = 500;
      return { success: false, message: "Internal server error" };
    }
  };

  getDirectSubfolders = async ({ params, set }: Context) => {
    try {
      const data = await this.service.getDirectSubfolders(params.id);
      set.status = 200;
      return { success: true, data };
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e) => e.message);
        set.status = 400;
        return { success: false, message: messages.join(", ") };
      }

      set.status = 500;
      return { success: false, message: "Internal server error" };
    }
  };

  getById = async ({ params, set }: Context) => {
    try {
      const data = await this.service.getById(params.id);
      if (!data) {
        set.status = 404;
        return { success: false, message: "Folder not found" };
      }
      set.status = 200;
      return { success: true, data };
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e) => e.message);
        set.status = 400;
        return { success: false, message: messages.join(", ") };
      }

      set.status = 500;
      return { success: false, message: "Internal server error" };
    }
  };
}
