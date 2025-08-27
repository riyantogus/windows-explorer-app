import { Context } from "elysia";
import { FileService } from "../services/file.service";
import { ZodError } from "zod";

export class FileController {
  constructor(private readonly service = new FileService()) {}

  getFilesByFolder = async ({ params, set }: Context) => {
    try {
      const data = await this.service.getFilesByFolder(params.id);
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
