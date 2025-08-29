export interface Folder {
  id: string
  name: string
  parentId: string | null
  path: string
  isOpen?: boolean
  children?: Folder[]
  files?: FileItem[]
  createdAt: Date
  updatedAt: Date
}

export interface FileItem {
  id: string
  name: string
  folderId: string
  createdAt: Date
  updatedAt: Date
}

export interface FolderState {
  folders: Folder[]
  selectedFolder: Folder | null
  currentPath: string
  loading: boolean
  error: string | null
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  status: number
}
