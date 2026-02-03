<template>
  <div class="code-input-group">
    <ElInput
      v-for="(_, index) in length"
      :key="index"
      ref="codeInputRefs"
      v-model="codeList[index]"
      class="code-input-item"
      size="small"
      maxlength="1"
      @input="handleInput(index)"
      @keydown.delete="handleDelete(index)"
      @focus="handleFocus(index)"
      :disabled="isDisabled"
      type="tel"
      :style="itemStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ElInput } from "element-plus";

const props = defineProps({
  // 验证码长度（默认6位）
  length: {
    type: Number,
    default: 6,
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  itemStyle: {
    type: Object,
    default: () => {
      return {
        width: "40px",
      };
    },
  },
});

const modelValue = defineModel({
  type: String,
  required: true,
});

const emits = defineEmits(["complete", "update:modelValue"]);

// 验证码数组
const codeList = ref(Array(props.length).fill(""));
watch(
  modelValue,
  (newValue) => {
    codeList.value = [
      ...(newValue ?? "").split(""),
      ...Array(props.length).fill(""),
    ];
    if (codeList.value.length != props.length) {
      codeList.value = codeList.value.slice(0, props.length);
    }
  },
  {
    immediate: true,
  },
);

// 输入框 refs
const codeInputRefs = ref<(typeof ElInput)[]>([]);
// 是否禁用
const isDisabled = computed(() => props.disabled);

// 输入处理（自动聚焦下一个）
const handleInput = (index: number) => {
  const value = codeList.value[index];
  // 仅允许数字（可根据需求修改为字母+数字）
  if (!/^\d?$/.test(value)) {
    codeList.value[index] = "";
    return;
  }
  // 输入完成，聚焦下一个
  if (value && index < props.length - 1) {
    codeInputRefs.value[index + 1]?.focus();
  }
  // 触发 change 事件
  const code = codeList.value.join("");
  // 全部输入完成，触发回调
  if (code.length === props.length) {
    emits("complete", code);
  }
  emits("update:modelValue", code);
};

// 删除键处理（自动聚焦上一个）
const handleDelete = (index: number) => {
  if (codeList.value[index] === "" && index > 0) {
    codeInputRefs.value[index - 1]?.focus();
  }
};

// 聚焦处理（选中当前内容，方便替换）
const handleFocus = (index: number) => {
  codeInputRefs.value[index]?.select();
};

// 重置验证码
const reset = () => {
  codeList.value = Array(props.length).fill("");
  // 聚焦第一个输入框
  codeInputRefs.value[0]?.focus();
};

// 暴露重置方法
defineExpose({ reset });
</script>

<style scoped>
.code-input-group {
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin: 5px;
  height: 40px;
}

.code-input-item {
  text-align: center;
  font-size: 16px;
  letter-spacing: 0;
  border-radius: 8px;
  width: 40px;
}

/* 适配 Element Plus 主题 */
:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #dcdfe6 !important;
}

:deep(.el-input__wrapper:focus-within) {
  border-color: #409eff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa !important;
  color: #c0c4cc !important;
}

:deep(.el-input__inner) {
  text-align: center;
}
</style>
