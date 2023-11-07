export interface InputProps {
  type: string;
  modelValue: string;
  size?: 'large' | 'small';
  disabled?: boolean;
  clearable?: boolean;
  showPassword?: boolean;
  // —————— 增加其余原生的Input属性 ——————
  placeHolder?: string;
  readonly?: boolean;
  autocomplete?: string;
  autofocus?: boolean;
  form?: string;
}

export interface InputEmits {
  // v-model的事件
  (e: 'update:modelValue', value: string) : void;
  // input组件的input事件值的是值有变化就算
  (e: 'input', value: string) : void;
  // input组件的change事件指的是修改了值，并且失去了focus
  (e: 'change', value: string) : void;
  (e: 'focus', value: FocusEvent): void;
  (e: 'blur', value: FocusEvent): void;
  (e: 'clear'): void;
}