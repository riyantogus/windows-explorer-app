import { Folder } from "../types/folder.types";

export interface FolderInterface {
  findAll(): Promise<Folder[]>;
  findDirectChildren(parentId: string): Promise<Folder[]>;
  findById(id: string): Promise<Folder | null>;
}
