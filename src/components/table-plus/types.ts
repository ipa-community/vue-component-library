/**
 * ElTablePlus 组件类型定义
 */

import type { VNode } from "vue";

import type { Column, TableColumnCtx } from "element-plus/es";
import type { Pager, PageResult } from "@ipa-schema/api";

/**
 * 列合并模式
 */
export type ColumnMergeMode = "replace" | "merge";

export type TableColumnV1 = TableColumnCtx;
export type TableColumnV2<T> = Column<T>;

export type TableColumn<T> = (TableColumnV1 | TableColumnV2<T>) & {
  width?: number;
  align?: string;
  label?: string;
  order?: number;
  cellRenderer?: (p: any) => VNode;
  [k: string]: any;
};

export interface ElTablePlusProps<T = any> {
  /** 获取数据的函数，返回 Promise<PageResult<T>> */
  fetchData?: (params: Pager) => Promise<PageResult<T> | undefined>;
  /** 表格列配置（为空时自动从数据推断） */
  columns?: TableColumn<any>[];
  /** 列合并模式：
   * - 'replace': 完全替换（如果提供了 columns 则只使用 columns，默认）
   * - 'append': 追加列（columns 追加到自动推测列后面）
   * - 'prepend': 前置列（columns 放在自动推测列前面）
   * - 'merge': 智能合并（columns 覆盖同 prop 的推测列，追加新列）
   */
  columnMergeMode?: ColumnMergeMode;
  /** 要隐藏的列（通过 prop/dataKey/key 匹配） */
  hiddenColumns?: string[];
  /** 只显示指定的列（通过 prop/dataKey/key 匹配，如果设置则只显示这些列） */
  showColumns?: string[];
  /** 是否自动加载数据（默认 true） */
  autoLoad?: boolean;
  /** 初始页码（默认 1） */
  initialPage?: number;
  /** 初始每页条数（默认 20） */
  initialPageSize?: number;
  /** 每页条数选项（默认 [10, 20, 50, 100]） */
  pageSizeOptions?: number[];
  /** 分页布局（默认 'total, sizes, prev, pager, next, jumper'） */
  paginationLayout?: string;
  /** 分页背景色（默认 true） */
  paginationBackground?: boolean;
  /** 是否显示分页（默认 true） */
  showPagination?: boolean;
  /** 空数据提示文本（默认 '暂无数据'） */
  emptyText?: string;
  /** 是否使用标准 el-table（默认 false，使用 el-table-v2） */
  version?: "v1" | "v2";
  /** 传递给 el-table 的其他属性 */
  tableProps?: Record<string, any>;
  columnProps?: Record<string, Partial<TableColumn<any>>>;
}
