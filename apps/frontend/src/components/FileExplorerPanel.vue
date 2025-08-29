<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useFolderStore } from "@/stores/folderStore";
import { computed, onMounted } from "vue";
import { ChevronLeft, CircleAlert, File, Folder, FolderX, LoaderCircle } from "lucide-vue-next";

const folderStore = useFolderStore();
const { selectFolder, goBack } = folderStore;

// Use storeToRefs untuk reactive state
const {
  loading,
  error,
  currentFolder,
  currentContents,
} = storeToRefs(folderStore);

const canGoBack = computed(() => folderStore.folderHistory.length > 0)

onMounted(async () => {
  await folderStore.initialize();
});
</script>

<template>
  <div class="content-panel h-full overflow-y-auto">
    <div v-if="loading" class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-md">
      <LoaderCircle class="animate-spin h-5 w-5 text-gray-500 flex-shrink-0" />
      <span class="text-sm font-medium">Loading...</span>
    </div>

    <div v-else-if="error"
      class="flex items-center gap-2 p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
      <CircleAlert class="h-5 w-5 flex-shrink-0" />
      <span class="text-sm font-medium">{{ error }}</span>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="px-4">
        <div class="flex items-center border-b border-gray-300 py-3">
          <button
            class="flex items-center justify-center pe-1 mr-3 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="goBack" :disabled="!canGoBack">
            <ChevronLeft class="h-5 w-5" />
          </button>

          <h2 class="text-lg font-semibold text-gray-800 truncate">
            {{ currentFolder?.name || 'Files' }}
          </h2>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Folders -->
        <div v-if="currentContents.folders.length > 0" class="my-6">
          <h3 class="text-sm font-medium text-gray-600 mb-3">Folders</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div v-for="folder in currentContents.folders" :key="folder.id"
              class="folder-item p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
              @click="selectFolder(folder)">
              <div class="flex items-center">
                <Folder class="text-gray-500 mr-3 w-5 h-5" />
                <span class="folder-name text-sm break-words flex-1">{{ folder.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Files -->
        <div v-if="currentContents.files.length > 0" class="my-6">
          <h3 class="text-sm font-medium text-gray-600 mb-3">Files</h3>
          <div class="grid grid-cols-1 gap-2">
            <div v-for="file in currentContents.files" :key="file.id"
              class="file-item p-3 border rounded flex items-center hover:bg-gray-50 transition-colors">
              <File class="text-gray-500 mr-3 w-5 h-5" />
              <div class="flex-1 min-w-0">
                <div class="file-name text-sm break-words">{{ file.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="currentContents.folders.length === 0 && currentContents.files.length === 0"
          class="flex flex-col items-center justify-center gap-2 text-gray-500 text-center py-12">
          <FolderX class="w-16 h-16" />
          <p class="text-sm">This folder is empty</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-panel {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.content-panel::-webkit-scrollbar {
  width: 6px;
}

.content-panel::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.content-panel::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.content-panel::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.folder-item,
.file-item {
  transition: all 0.2s ease;
}

.folder-item:hover,
.file-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>