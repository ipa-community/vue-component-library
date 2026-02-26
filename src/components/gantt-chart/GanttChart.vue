<template>
  <div v-bind="$attrs">
    <VChart
      ref="chartRef"
      class="gantt-container"
      :option="option"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import type {
  EChartsOption,
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemReturn,
} from "echarts";
import { graphic } from "echarts";
import VChart from "vue-echarts";
import type {
  GanttChartProps,
  GanttItem,
  GanttSegmentSeriesData,
} from "./types";
import { browser } from "@ipa-community/node-kit";

const props = defineProps<GanttChartProps>();

const modelValue = defineModel<GanttItem[]>({
  required: true,
});

const chartRef = useTemplateRef("chartRef");

const buildData = (items: GanttItem[]) => {
  const categories = items.map((i) => i.name);
  const seriesData: GanttSegmentSeriesData[] = [];

  items.forEach((task, idx) => {
    const total = task.segments
      ?.map((x) => Math.abs(x.end - x.start))
      .reduce((a, b) => a + b, 0);
    task.segments?.forEach((segment) => {
      const s = segment.start;
      const e = segment.end;
      seriesData.push({
        value: [s, e, idx],
        name: task.name,
        segment,
        duration: Math.abs(e - s),
        totalDuration: total,
      });
    });
  });

  return {
    categories,
    seriesData,
  };
};

const renderItem = (
  params: CustomSeriesRenderItemParams,
  api: CustomSeriesRenderItemAPI,
): CustomSeriesRenderItemReturn => {
  const start = api.value(0);
  const end = api.value(1);
  const yIndex = api.value(2);
  // console.log('renderItem', api.value(3), params, api.value('segment'))

  const p1 = api.coord([start, yIndex]);
  const p2 = api.coord([end, yIndex]);

  const height = props.barHeight ?? (api.size!([0, 1]) as number[])[1] * 0.6;
  const y = p1[1] - height / 2;

  const coordSys = params.coordSys as any;
  const shape = graphic.clipRectByRect(
    {
      x: Math.min(p1[0], p2[0]),
      y,
      width: Math.abs(p2[0] - p1[0]),
      height,
    },
    {
      x: coordSys.x,
      y: coordSys.y,
      width: coordSys.width,
      height: coordSys.height,
    },
  );

  if (!shape) return null;

  const color = browser.resolveCssVar(props.barColor ?? "#5470c6");

  return {
    type: "rect",
    shape,
    style: api.style({
      fill: color,
      stroke: color,
      borderRadius: props.barBorderRadius ?? 10,
    }),
  };
};

const option = computed((): EChartsOption => {
  const { categories, seriesData } = buildData(modelValue.value);
  const formatter = (
    props.barFormatter
      ? props.barFormatter
      : (p: any) => {
          const s = p.value[0];
          const e = p.value[1];
          return `${p.name}<br/>开始时间: ${s}<br/>结束时间: ${e}`;
        }
  ) as any;
  return {
    dataZoom: {
      id: "dataZoom",
      type: "inside",
      orient: "vertical",
    },
    ...props.echartsConfig,
    tooltip: {
      formatter,
    },
    grid: {
      left: 80,
      right: 20,
      top: 20,
      bottom: 40,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: categories,
      inverse: true,
    },
    series: [
      {
        type: "custom",
        renderItem,
        encode: {
          x: [0, 1],
          y: 2,
          segment: 3,
        },
        data: seriesData,
      },
    ],
  };
});

onMounted(async () => {
  await nextTick();
});

const minHeight = computed(
  () =>
    `${props.lineHeight ? props.lineHeight * modelValue.value.length : 400}px`,
);
</script>

<style scoped>
.gantt-container {
  width: 100%;
  min-height: v-bind(minHeight);
}
</style>
