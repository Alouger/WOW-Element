import type { InjectionKey } from 'vue'
// RuleItem是async-validator提供的规则类型
import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator'

export interface FormItemProps {
  label: string;
  // 规定这个FormItem要从FormContext取什么数据
  prop?: string;
}

export type FormRules = Record<string, RuleItem[]>

export interface FormProps {
  model: Record<string, any>;
  rules: FormRules;
}

export interface FormContext extends FormProps {
  
}

export interface FormItemContext {
  validate: () => any;
}

export interface FormValidateFailure {
  errors: ValidateError[] | null;
  fields: ValidateFieldsError;
}

export const formContextKey: InjectionKey<FormContext> = Symbol('formContextKey')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('formItemContextKey')