import { Elysia } from "elysia";
import { FileController } from "../controllers/file.controller";

export const fileRoutesV1 = (app: Elysia) => {
  const controller = new FileController();

  return app.group("/api/v1/files", (app) =>
    app.get("/folder/:id", controller.getFilesByFolder),
  );
};
