import type { InjectionKey } from 'vue'
// RuleItem是async-validator提供的规则类型
import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator'

export interface FormItemProps {
  label: string;
  // 规定这个FormItem要从FormContext取什么数据
  prop?: string;
}

// FormRules原本用到的是RuleItem数组，其实RuleItem中并没有对应的trigger
// 而我们在Basic.vue传入Form标签的rules里的trigger是我们自己加的。为了甄别，在不同事件进行触发，我们需要修改一下
// 做一个继承的操作，让FormItemRule比RuleItem多一个我们需要参数————trigger
export interface FormItemRule extends RuleItem {
  trigger?: string;
}

// export type FormRules = Record<string, RuleItem[]>
export type FormRules = Record<string, FormItemRule[]>

export interface FormProps {
  model: Record<string, any>;
  rules: FormRules;
}

export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void;
  removeField: (field: FormItemContext) => void;
}

export interface FormItemContext {
  validate: (trigger?: string) => any;
  prop: string;
}

export interface FormValidateFailure {
  errors: ValidateError[] | null;
  fields: ValidateFieldsError;
}

// // 因为我们要把整体验证的validate函数暴露出去，所以要写instance
export interface FormInstance {
  validate: () => Promise<any>
}

export const formContextKey: InjectionKey<FormContext> = Symbol('formContextKey')
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('formItemContextKey')