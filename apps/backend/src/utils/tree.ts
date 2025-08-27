import { Folder } from "../types/folder.types";

export interface FolderNode extends Folder {
  children: FolderNode[];
}

export function buildTree(folders: Folder[]): FolderNode[] {
  const map = new Map<string, FolderNode>();

  folders.forEach((f) => {
    map.set(f.id, { ...f, children: [] });
  });

  const tree: FolderNode[] = [];

  map.forEach((node) => {
    if (node.parentId) {
      const parent = map.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      tree.push(node);
    }
  });

  return tree;
}
