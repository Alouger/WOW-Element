import type { Ref, InjectionKey } from 'vue'

export type NameType = string | number;

export interface CollapseProps {
    // 当前打开的 items，可以多个，所以这里给NameType用数组，比如 ref(['a', 'c'])
    // 那么就是 a，c item打开
    modelValue: NameType[];
    // accordion属性用于实现手风琴效果，但不是必选项，是可选项
    accordion?: boolean;
}

export interface CollapseItemProps {
    // name: string | number;
    // 因为 string | number 这个联合类型会经常被用到，所以我们把它单独写成一个类型 NameType
    name: NameType;
    title?: string;
    disabled?: boolean;
}

// 对modelValue的事件进行规定描述
export interface CollapseEmits {
    // v-model事件的名称和属性的名称都是固定的，vue3文档里有写。返回的是void类型
    (e: 'update:modelValue', value: NameType[]) : void;
    // change是点击任何一个title时触发的事件
    (e: 'change', value: NameType[]) : void;
}

// 用于描述从父组件Collapse传递到子组件CollapseItem的Context
export interface CollapseContext {
    activeNames: Ref<NameType[]>;
    handlerItemClick: (name: NameType) => void;
}

// 用Symbol创建独一无二的Key, 用上面写好的CollapseContext，规定provide和inject之间传递的数据类型格式
export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContextKey');