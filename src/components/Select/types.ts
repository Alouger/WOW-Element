import type { VNode } from 'vue'

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

// 自定义模板的函数
export type RenderLabelFunc = (option: SelectOption) => VNode;
// 自定义筛选的函数
export type CustomFilterFunc = (value: string) => SelectOption[];
// 自定义远程搜索的处理函数，因为是异步的，所以返回的是Promise
export type CustomFilterRemoteFunc = (value: string) => Promise<SelectOption[]>;

export interface SelectProps {
  // v-model
  modelValue: string;
  // 选项。 因为我们的数据是可以远程获取了的，所以这个属性可以不是必选项，不传也是可以的，加上问号
  // options:SelectOption[];
  options?:SelectOption[];
  // 一些基本表单属性
  placeholder: string;
  disabled: boolean;
  clearable?: boolean;
  renderLabel?: RenderLabelFunc;
  // 是否允许开启筛选
  filterable?: boolean;
  filterMethod?: CustomFilterFunc;
  // 是否开启远程搜索功能
  remote?: boolean;
  remoteMethod?: CustomFilterRemoteFunc;
}

export interface SelectStates {
  // input的值
  inputValue: string;
  // 代表我们之前选择的是哪个选项，最初页面一打开可能是null
  selectedOption: null | SelectOption;
  mouseHover: boolean;
  loading: boolean;
  highlightIndex: number;
}

export interface SelectEmits {
  (e: 'change', value: string): void;
  (e: 'update:modelValue', value: string): void;
  // 当前下拉菜单是否展开的事件
  (e: 'visible-change', value: boolean): void;
  (e: 'clear'): void;
}