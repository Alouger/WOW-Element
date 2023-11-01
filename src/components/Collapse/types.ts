import type { Ref, InjectionKey } from 'vue'

export type NameType = string | number;

export interface CollapseItemProps {
    // name: string | number;
    // 因为 string | number 这个联合类型会经常被用到，所以我们把它单独写成一个类型 NameType
    name: NameType;
    title?: string;
    disabled?: boolean;
}

// 用于描述从父组件Collapse传递到子组件CollapseItem的Context
export interface CollapseContext {
    activeNames: Ref<NameType[]>;
    handlerItemClick: (name: NameType) => void;
}

// 用Symbol创建独一无二的Key, 用上面写好的CollapseContext，规定provide和inject之间传递的数据类型格式
export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContextKey');