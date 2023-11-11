import type { InjectionKey } from 'vue'

export interface FormItemProps {
  label: string;
  // 规定这个FormItem要从FormContext取什么数据
  prop?: string;
}

export interface FormProps {
  model: Record<string, any>
  rules: Record<string, any>
}

export interface FormContext extends FormProps {
  
}

export const formContextKey: InjectionKey<FormContext> = Symbol('formContextKey')