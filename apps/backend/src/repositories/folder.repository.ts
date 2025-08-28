import { prisma } from "../config/database";
import { FolderInterface } from "../contracts/folder.interface";
import { Folder } from "../types/folder.types";

export class FolderRepository implements FolderInterface {
  constructor(private readonly repo = prisma) {}

  async findAll(): Promise<Folder[]> {
    try {
      return await this.repo.folder.findMany({
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error("Failed to fetch folders");
    }
  }

  async findDirectChildren(parentId: string): Promise<Folder[]> {
    try {
      return await this.repo.folder.findMany({
        where: { parentId },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch children for parentId=${parentId}`);
    }
  }

  async findById(id: string): Promise<Folder | null> {
    try {
      return await this.repo.folder.findUnique({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to fetch folder with id=${id}`);
    }
  }
}
