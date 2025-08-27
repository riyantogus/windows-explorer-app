import { File } from "../types/file.types";

export interface FileInterface {
  getFilesByFolder(folderId: string): Promise<File[]>;
}
