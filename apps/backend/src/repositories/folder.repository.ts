import { prisma } from "../config/database";
import { FolderInterface } from "../contracts/folder.interface";
import { Folder } from "../types/folder.types";

export class FolderRepository implements FolderInterface {
  async findAll(): Promise<Folder[]> {
    try {
      return await prisma.folder.findMany({
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error("Failed to fetch folders");
    }
  }

  async findDirectChildren(parentId: string): Promise<Folder[]> {
    try {
      return await prisma.folder.findMany({
        where: { parentId },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch children for parentId=${parentId}`);
    }
  }

  async findById(id: string): Promise<Folder | null> {
    try {
      return await prisma.folder.findUnique({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to fetch folder with id=${id}`);
    }
  }
}
