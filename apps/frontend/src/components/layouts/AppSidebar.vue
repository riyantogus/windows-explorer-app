<script setup lang="ts">
import { onMounted } from "vue"
import { storeToRefs } from 'pinia'
import { AlertCircle, GalleryVerticalEnd } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  type SidebarProps
} from "../ui/sidebar"
import { useFolderStore } from "@/stores/folderStore"
import type { Folder } from "@/types/index"
import SearchForm from '@/components/SearchForm.vue'
import FolderTreeItem from "@/components/FolderTreeItem.vue"

const props = defineProps<SidebarProps>()

const folderStore = useFolderStore()
const { folders, selectedFolder, loading, error } = storeToRefs(folderStore)

onMounted(() => {
  folderStore.loadAllFolders()
})

const handleFolderSelect = (folder: Folder) => {
  folderStore.selectFolder(folder)
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">Windows Explorer</span>
                <span class="">v1.0.0</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SearchForm />
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <template v-if="loading">
            <SidebarMenuItem>Loading folders...</SidebarMenuItem>
          </template>

          <template v-else-if="error">
            <SidebarMenuItem
              class="flex items-center gap-2 px-4 py-2 text-red-700 bg-red-100 rounded-md cursor-default">
              <AlertCircle class="h-4 w-4 flex-shrink-0" />
              <span class="truncate text-sm font-medium">{{ error }}</span>
            </SidebarMenuItem>
          </template>

          <template v-else-if="folders.length === 0">
            <SidebarMenuItem>No folders found</SidebarMenuItem>
          </template>

          <template v-else>
            <FolderTreeItem v-for="folder in folders" :key="folder.id" :folder="folder"
              :selected-folder="selectedFolder" @select-folder="handleFolderSelect" />
          </template>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <SidebarRail />
  </Sidebar>
</template>
