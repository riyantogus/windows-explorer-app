import { z } from "zod";

export const fileFolderIdSchema = z.object({
  folderId: z.uuid({
    error: "The folderId must be a valid UUID",
  }),
});
