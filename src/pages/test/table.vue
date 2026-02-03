<template>
  <div>
    <!-- <ElTablePlus version="v1" :auto-load="false" v-model="rows" /> -->
    <div class="h-400px">
      <ElTablePlus version="v2" :auto-load="false" v-model="rows" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElTablePlus } from "@/components/index";
const rows = ref([
  {
    id: 1,
    name: "张三",
    age: 18,
  },
  {
    id: 2,
    name: "李四",
    age: 20,
  },
]);
</script>

<style scoped></style>
