import { Elysia } from "elysia";
import { folderRoutesV1 } from "./routes/folder.route.v1";
import { fileRoutesV1 } from "./routes/file.route.v1";

const app = new Elysia().use(folderRoutesV1).use(fileRoutesV1).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
