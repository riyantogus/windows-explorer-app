import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { FileItem, Folder } from '@/types/index'
import { useFolderService } from '@/services/folderService'

export const useFolderStore = defineStore('folder', () => {
  const folders = ref<Folder[]>([])
  const selectedFolder = ref<Folder | null>(null)
  const currentFolder = ref<Folder | null>(null)
  const folderHistory = ref<Folder[]>([])
  const expandedFolderIds = ref<Set<string>>(new Set())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const currentContents = ref<{ folders: Folder[]; files: FileItem[] }>({
    folders: [],
    files: [],
  })

  const folderService = useFolderService()

  // Tambahkan isOpen rekursif tanpa buat tree lagi
  const addIsOpenRecursively = (folders: Folder[]): Folder[] => {
    return folders.map((f) => ({
      ...f,
      isOpen: f.isOpen ?? expandedFolderIds.value.has(f.id),
      children: f.children ? addIsOpenRecursively(f.children) : [],
    }))
  }

  const loadAllFolders = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await folderService.getAllFolders()

      // Tandai semua folder sebagai expanded default
      data.forEach((f) => expandedFolderIds.value.add(f.id))

      // Tambahkan isOpen rekursif
      folders.value = addIsOpenRecursively(data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load folders'
    } finally {
      loading.value = false
    }
  }

  const selectFolder = async (folder: Folder) => {
    if (currentFolder.value) {
      folderHistory.value.push(currentFolder.value)
    }

    currentFolder.value = folder
    selectedFolder.value = folder

    // Load contents untuk folder yang dipilih
    const contents = await folderService.getFolderContents(folder.id)
    currentContents.value = contents
  }

  const loadFolderContents = async (folderId: string) => {
    loading.value = true
    error.value = null
    try {
      const contents = await folderService.getFolderContents(folderId)
      currentContents.value = contents
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load folder contents'
    } finally {
      loading.value = false
    }
  }

  const goBack = async () => {
    if (folderHistory.value.length > 0) {
      const previousFolder = folderHistory.value.pop() || null
      if (previousFolder) {
        currentFolder.value = previousFolder
        selectedFolder.value = previousFolder
        await loadFolderContents(previousFolder.id)
      }
    }
  }

  const initialize = async () => {
    await loadAllFolders()
    // Set root folder as current if available
    if (folders.value.length > 0) {
      currentFolder.value = folders.value[0]
      await loadFolderContents(folders.value[0].id)
    }
  }

  return {
    folders,
    selectedFolder,
    currentFolder,
    currentContents,
    folderHistory,
    loading,
    error,
    loadAllFolders,
    selectFolder,
    goBack,
    initialize,
  }
})
