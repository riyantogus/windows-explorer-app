import { z } from "zod";

export const folderIdSchema = z.object({
  id: z.uuid({
    error: "The folderId must be a valid UUID",
  }),
});
