import { FileRepository } from "../repositories/file.repository";
import { File } from "../types/file.types";
import { fileFolderIdSchema } from "../validation/file.validation";

export class FileService {
  constructor(private readonly repo = new FileRepository()) {}

  async getFilesByFolder(folderId: string): Promise<File[]> {
    const validated = fileFolderIdSchema.parse({ folderId });
    return this.repo.getFilesByFolder(validated.folderId);
  }
}
