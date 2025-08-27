import { FolderRepository } from "../repositories/folder.repository";
import { buildTree } from "../utils/tree";
import { Folder } from "../types/folder.types";
import { folderIdSchema } from "../validation/folder.validation";

export class FolderService {
  constructor(private readonly repo = new FolderRepository()) {}

  async getFullTree(): Promise<Folder[]> {
    const rows = await this.repo.findAll();
    return buildTree(rows);
  }

  async getDirectSubfolders(folderId: string): Promise<Folder[]> {
    const validated = folderIdSchema.parse({ id: folderId });
    return this.repo.findDirectChildren(validated.id);
  }

  async getById(id: string): Promise<Folder | null> {
    const validated = folderIdSchema.parse({ id });
    return this.repo.findById(validated.id);
  }
}
