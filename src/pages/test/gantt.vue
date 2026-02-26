<template>
  <div>
    <GanttChart
      :model-value="[
        {
          name: '任务1',
          segments: [
            {
              name: '子任务1',
              start: 10,
              end: 30,
            },
          ],
        },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { GanttChart } from "@/components/index";
</script>

<style scoped></style>
