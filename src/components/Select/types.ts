export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  // v-model
  modelValue: string;
  // 选项
  options:SelectOption[];
  // 一些基本表单属性
  placeholder: string;
  disabled: boolean;
}

export interface SelectEmits {
  (e: 'change', value: string): void;
  (e: 'update:modelValue', value: string): void;
  // 当前下拉菜单是否展开的事件
  (e: 'visible-change', value: boolean): void;
}