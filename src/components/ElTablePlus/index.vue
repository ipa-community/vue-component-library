<template>
  <div class="el-table-plus">
    <slot name="header">
      <div class="flex flex-row-reverse z-100000000">
        <el-tooltip
          v-if="fetchData"
          placement="left"
          :content="i18n.t('refresh')"
        >
          <el-icon
            size="18"
            color="var(--el-color-primary)"
            @click="loadData(true)"
            ><TablerRefresh
          /></el-icon>
        </el-tooltip>
      </div>
    </slot>
    <div v-loading="loading" class="el-table-plus__container">
      <el-table
        ref="tableRef"
        v-if="version === 'v1'"
        v-bind="tableProps"
        :data="modelValue"
        class="el-table-plus__table"
        stripe
      >
        <template v-for="col in actualColumns" :key="col.prop || col.label">
          <el-table-column v-bind="col">
            <template #default="{ row, column }">
              <component
                v-if="col.cellRenderer"
                :is="col.cellRenderer({ row, column })"
              />
              <div v-else-if="isColumnDefaultType(col)">
                {{ row[col.prop || col.dataKey!] }}
              </div>
            </template>
          </el-table-column>
        </template>
        <template #empty>
          <slot name="empty">
            <el-empty :description="emptyText" />
          </slot>
        </template>
      </el-table>

      <el-auto-resizer v-else class="el-table-plus__resizer">
        <template #default="{ height, width }">
          <el-table-v2
            ref="tableRef"
            v-bind="tableProps"
            :columns="actualColumns"
            :data="modelValue"
            :width="width"
            :height="height"
            class="el-table-plus__table-v2"
          />
        </template>
      </el-auto-resizer>
    </div>
    <div
      v-if="showPagination && (modelValue.length > 0 || total > 0)"
      class="el-table-plus__pagination"
    >
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizeOptions"
        :total="total"
        :layout="paginationLayout"
        :background="paginationBackground"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any> = any">
import type { PageResult, Pager } from "@ipa-schema/api";
import type { ElTablePlusProps, TableColumn } from "./types";
import { useI18n } from "vue-i18n";
import { isEmpty } from "lodash-es";
import TablerRefresh from "~icons/tabler/refresh";
const i18n = useI18n();

const props = withDefaults(defineProps<ElTablePlusProps<T>>(), {
  columns: () => [],
  columnMergeMode: "replace",
  hiddenColumns: () => [],
  showColumns: () => [],
  autoLoad: true,
  initialPage: 1,
  initialPageSize: 20,
  pageSizeOptions: () => [10, 20, 50, 100],
  paginationLayout: "total, sizes, prev, pager, next, jumper",
  paginationBackground: true,
  showPagination: true,
  emptyText: "暂无数据",
  useStandardTable: false,
  tableProps: () => ({}),
  columnProps: () => ({}),
});

const emit = defineEmits<{
  "page-change": [page: number, pageSize: number];
  "size-change": [pageSize: number];
  "load-success": [data: T[], total: number];
  "load-error": [error: any];
  "update:modelValue": [tableData: T[]];
}>();

// 状态管理
const loading = ref(false);
const modelValue = defineModel<T[]>({
  default: [],
  required: false,
});

const total = ref(0);
const currentPage = ref(props.initialPage);
const pageSize = ref(props.initialPageSize);

const isColumnDefaultType = (col: any) => {
  const type = col.type;
  return !type || type === "default";
};

/**
 * 将 camelCase 或 snake_case 转换为可读的标题
 */
const formatColumnLabel = (key: string): string => {
  return i18n.t(key);
};

const inferWidth = (value: any, min = 20, max = 200) => {
  const ideal = String(value).length * 5;
  // if (ideal < min || ideal > max) {
  //   return 'auto'
  // }
  return Math.min(max, Math.max(min, ideal));
};

/**
 * 根据数据自动推断列配置
 */
const inferColumnsFromData = (data: any[]): TableColumn<any>[] => {
  if (!data || data.length === 0) {
    return [];
  }

  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  return keys.map((key) => {
    const label = formatColumnLabel(key);
    const value = firstRow[key];
    const common = {
      minWidth: 40,
      align: "center",
    };
    return (
      props.version === "v2"
        ? {
            title: label,
            width: inferWidth(value),
            dataKey: key,
            key,
            ...common,
          }
        : {
            prop: key,
            property: key,
            label,
            width: "",
            ...common,
          }
    ) as TableColumn<any>;
  });
};

/**
 * 获取列的唯一标识
 */
const getColumnKey = (col: TableColumn<any>): string => {
  return col.prop || col.dataKey || col.key || col.label;
};
/**
 * 规范化列配置
 */
const normalizeColumn = (col: TableColumn<any>): TableColumn<any> => {
  const normalized = {
    ...col,
  };

  // 如果没有 key，自动生成
  if (!normalized.key) {
    normalized.key = getColumnKey(col);
  }

  // 如果没有 dataKey（el-table-v2 需要），使用 prop 或 key
  if (!normalized.dataKey && normalized.prop) {
    normalized.dataKey = normalized.prop;
  }

  // 默认宽度
  if (!normalized.width && !normalized.minWidth) {
    normalized.width = 150;
  }
  // 默认居中对齐（操作列）
  if (!normalized.align) {
    normalized.align = "center";
  }
  return normalized;
};

/**
 * 过滤列（根据 hidden、hiddenColumns、showColumns）
 */
const filterColumns = (columns: TableColumn<any>[]): TableColumn<any>[] => {
  let filtered = columns;

  // 1. 如果设置了 showColumns，只显示指定的列
  if (props.showColumns && props.showColumns.length > 0) {
    const onlyShowSet = new Set(props.showColumns);
    filtered = filtered.filter((col) => {
      const key = getColumnKey(col);
      return onlyShowSet.has(key);
    });
  } else {
    // 2. 过滤掉 hidden: true 的列
    filtered = filtered.filter((col) => !col.hidden);
    // 3. 过滤掉 hiddenColumns 中指定的列
    if (props.hiddenColumns && props.hiddenColumns.length > 0) {
      const hiddenSet = new Set(props.hiddenColumns);
      filtered = filtered.filter((col) => {
        const key = getColumnKey(col);
        return !hiddenSet.has(key);
      });
    }
  }
  return filtered;
};

/**
 * 实际使用的列配置（自动推断或使用传入的配置）
 */
const actualColumns = computed<TableColumn<any>[]>(() => {
  // 自动推测列
  const inferredColumns = inferColumnsFromData(modelValue.value as any[]);

  // 根据合并模式处理列
  const mode = props.columnMergeMode || "replace";
  const customColumns = (props.columns ?? []).map((col) =>
    normalizeColumn(col),
  );

  let mergedColumns: TableColumn<any>[] = [];

  switch (mode) {
    case "replace":
      mergedColumns =
        customColumns.length > 0 ? customColumns : inferredColumns;
      break;

    case "merge": {
      mergedColumns = inferredColumns.map((col) => normalizeColumn(col));
      customColumns.forEach((customCol) => {
        const key = getColumnKey(customCol);
        const index = mergedColumns.findIndex(
          (col) => getColumnKey(col) === key,
        );
        if (index >= 0) {
          mergedColumns[index] = {
            ...mergedColumns[index],
            ...customCol,
          };
        } else {
          mergedColumns.push(customCol);
        }
      });
      break;
    }

    default:
      mergedColumns = inferredColumns;
  }
  mergedColumns = mergedColumns
    .map((col) => {
      Object.assign(col, props.columnProps[col.dataKey as string] || {});
      return col;
    })
    .sort((a, b) => {
      const d = 1000000;
      const x = a.order ?? d;
      const y = b.order ?? d;
      return x - y;
    });
  // 应用过滤规则
  return filterColumns(mergedColumns);
});

const onDataFetched = (result: PageResult<T> | undefined) => {
  if (!result) {
    emit("load-error", `未查询到数据`);
    return;
  }
  const data = result.items || [];
  const totalCount = result?.total || 0;

  modelValue.value = data;
  total.value = totalCount;

  emit("load-success", data, totalCount);
};
const resetMetadata = () => {
  currentPage.value = props.initialPage;
  modelValue.value = [];
  total.value = 0;
};
/**
 * 加载数据
 */
const loadData = async (resetPage = false, data?: PageResult<T>) => {
  if (resetPage) {
    resetMetadata();
  }
  if (data) {
    onDataFetched(data);
    return;
  }
  if (!props.fetchData) {
    console.warn("ElTablePlus: fetchData prop is required");
    return;
  }

  loading.value = true;
  try {
    const params: Pager = {
      pageAt: currentPage.value,
      pageSize: pageSize.value,
      pageBase: 1,
      total: 0,
    };
    const result = await props.fetchData(params);
    onDataFetched(result);
  } catch (error) {
    console.error("ElTablePlus load data error:", error);
    emit("load-error", error);
  } finally {
    loading.value = false;
  }
};

/**
 * 处理每页条数变化
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = props.initialPage;
  loadData(false);
  emit("size-change", val);
};

/**
 * 处理页码变化
 */
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  loadData(false);
  emit("page-change", val, pageSize.value);
};

/**
 * 刷新数据（保持当前页码）
 */
const refresh = () => {
  loadData(false);
};

/**
 * 重置并重新加载（回到第一页）
 */
const reset = () => {
  loadData(true);
};

const tableRef = useTemplateRef("tableRef");

const deleteRow = (
  row: any,
  predicate?: (v: T, idx: number, arr: any[]) => boolean,
) => {
  predicate = predicate ?? ((v) => v === row);
  const at = modelValue.value.findIndex(predicate);
  if (at < 0) {
    return;
  }
  // const deleted = remove(modelValue.value, predicate )
  const deleted = modelValue.value.splice(at, 1);
  total.value -= deleted.length;
  // FIXME：为什么splice不起作用呢
  modelValue.value = [...modelValue.value];
  emit("update:modelValue", modelValue.value);

  if (isEmpty(modelValue.value)) {
    refresh();
  }
};

// 暴露方法供外部调用
defineExpose({
  refresh,
  reset,
  loadData,
  currentPage,
  pageSize,
  total,
  tableData: modelValue,
  deleteRow,
});

// 自动加载
onMounted(() => {
  if (props.autoLoad) {
    loadData(true);
  }
});

// 监听 props 变化，重新加载（可选）
watch(
  () => [props.fetchData, props.columns],
  () => {
    if (props.autoLoad) {
      loadData(true);
    }
  },
  {
    deep: true,
  },
);
</script>

<style scoped lang="scss">
.el-table-plus {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  &__resizer {
    flex: 1;
    min-height: 0;
  }

  &__table {
    width: 100%;
  }

  &__table-v2 {
    width: 100%;
  }

  &__pagination {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
