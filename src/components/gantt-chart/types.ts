import type { EChartsOption } from "echarts";

export type TimeType = "absolute" | "relative";

export interface Task {
  id: number | string;
  name: string;
  /**
   * 单位毫秒
   */
  start: number;
  /**
   * 单位毫秒
   */
  end: number;
  status?: string;
}

export interface GanttSegment {
  id?: number | string;
  name?: string;
  start: number;
  end: number;
  [key: string]: any;
}

export interface GanttItem {
  name: string;
  segments?: GanttSegment[];
  [key: string]: any;
}
export interface GanttSegmentSeriesData {
  id?: number | string;
  name: string;
  value: [number, number, number, ...any];
  totalDuration?: number;
  duration?: number;
  [key: string]: any;
}
export interface GanttChartProps {
  lineHeight?: number;
  barHeight?: number;
  barColor?: string;
  barBorderRadius?: number;
  barFormatter?: (p: GanttSegmentSeriesData) => string;
  echartsConfig?: Partial<EChartsOption>;
}
