import { Elysia } from "elysia";
import { FolderController } from "../controllers/folder.controller";

export const folderRoutesV1 = (app: Elysia) => {
  const controller = new FolderController();

  return app.group("/api/v1/folders", (app) =>
    app
      .get("/tree", controller.getFullTree)
      .get("/:id/children", controller.getDirectSubfolders)
      .get("/:id", controller.getById),
  );
};
