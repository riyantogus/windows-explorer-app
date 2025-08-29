import { ref } from 'vue'
import type { Folder, FileItem, ApiResponse } from '@/types/index'

const API_BASE_URL = import.meta.env.API_BASE_URL ?? 'http://localhost:3000/api/v1'

export const useFolderService = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const handleError = (err: unknown) => {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    throw err
  }

  const getAllFolders = async (): Promise<Folder[]> => {
    try {
      loading.value = true
      const response = await fetch(`${API_BASE_URL}/folders/tree`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<Folder[]> = await response.json()
      return result.data
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  const getFolderContents = async (
    folderId: string,
  ): Promise<{ folders: Folder[]; files: FileItem[] }> => {
    loading.value = true
    try {
      const [foldersRes, filesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/folders/${folderId}/children`),
        fetch(`${API_BASE_URL}/files/folder/${folderId}`),
      ])

      if (!foldersRes.ok || !filesRes.ok) {
        throw new Error(`HTTP error! folder=${foldersRes.status}, files=${filesRes.status}`)
      }

      const foldersJson: ApiResponse<Folder[]> = await foldersRes.json()
      const filesJson: ApiResponse<FileItem[]> = await filesRes.json()

      if (!foldersJson.success || !filesJson.success) {
        throw new Error('Failed to fetch folder contents')
      }

      return {
        folders: foldersJson.data ?? [],
        files: filesJson.data ?? [],
      }
    } catch (err) {
      console.error('getFolderContents error:', err)
      return { folders: [], files: [] }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getAllFolders,
    getFolderContents,
  }
}
