import { prisma } from "../config/database";
import { FileInterface } from "../contracts/file.interface";
import { File } from "../types/file.types";

export class FileRepository implements FileInterface {
  constructor(private readonly repo = prisma) {}

  async getFilesByFolder(folderId: string): Promise<File[]> {
    try {
      return await this.repo.file.findMany({
        where: { folderId },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch files for folderId=${folderId}`);
    }
  }
}
