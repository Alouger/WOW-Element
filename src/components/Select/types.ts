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

export interface SelectStates {
  // input的值
  inputValue: string;
  // 代表我们之前选择的是哪个选项，最初页面一打开可能是null
  selectedOption: null | SelectOption;
}

export interface SelectEmits {
  (e: 'change', value: string): void;
  (e: 'update:modelValue', value: string): void;
  // 当前下拉菜单是否展开的事件
  (e: 'visible-change', value: boolean): void;
}