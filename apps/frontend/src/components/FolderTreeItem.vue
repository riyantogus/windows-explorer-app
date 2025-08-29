<script setup lang="ts">
import { computed, reactive } from "vue";
import type { Folder } from "@/types/index";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "./ui/sidebar";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { useFolderStore } from "@/stores/folderStore";

const { folder: propFolder } = defineProps<{ folder: Folder }>();
const folder = reactive({ ...propFolder });

const folderStore = useFolderStore();
const selectedFolder = computed(() => folderStore.selectedFolder);
const hasChildren = computed(() => (folder.children?.length ?? 0) > 0);

const selectFolder = (f: Folder) => {
  folderStore.selectFolder(f);
};
</script>

<template>
  <Collapsible v-model="folder.isOpen" class="group/collapsible">
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton class="flex items-center justify-between w-full min-w-0"
          :is-active="selectedFolder?.id === folder.id" @click="selectFolder(folder)">
          <span class="truncate flex-1 text-left pr-2">{{ folder.name }}</span>
          <template v-if="hasChildren">
            <ChevronDown class="flex-shrink-0 size-16 group-data-[state=open]/collapsible:hidden" />
            <ChevronUp class="flex-shrink-0 size-16 group-data-[state=closed]/collapsible:hidden" />
          </template>
        </SidebarMenuButton>
      </CollapsibleTrigger>

      <CollapsibleContent v-if="hasChildren">
        <SidebarMenuSub>
          <div v-for="child in folder.children" :key="child.id" class="pl-4">
            <Collapsible v-model="child.isOpen" class="group/nested">
              <SidebarMenuSubItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuSubButton class="flex items-center justify-between w-full min-w-0"
                    @click="selectFolder(child)">
                    <span class="truncate flex-1 text-left pr-2">{{ child.name }}</span>
                    <template v-if="child.children?.length">
                      <ChevronDown class="flex-shrink-0 size-16 group-data-[state=open]/nested:hidden" />
                      <ChevronUp class="flex-shrink-0 size-16 group-data-[state=closed]/nested:hidden" />
                    </template>
                  </SidebarMenuSubButton>
                </CollapsibleTrigger>

                <CollapsibleContent v-if="child.children?.length">
                  <SidebarMenuSub class="pl-4">
                    <FolderTreeItem v-for="grandChild in child.children" :key="grandChild.id" :folder="grandChild" />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuSubItem>
            </Collapsible>
          </div>
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
</template>