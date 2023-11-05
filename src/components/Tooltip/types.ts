import type { Placement, Options } from '@popperjs/core'
export interface TooltipProps {
  content?: string;
  trigger?: 'hover' | 'click'
  placement?: Placement;
  manual?: boolean;
  // 为了让Options里面的必选参数在此变成可选，需要用Partial
  popperOptions?: Partial<Options>;
  transition?: string;
}

// 对应的事件
export interface TooltipEmits {
  (e: 'visible-change', value: boolean): void;
}

// 要暴露的两个方法，作为给用户进行手动执行的
export interface TooltipInstance {
  show: () => void;
  hide: () => void;
} 