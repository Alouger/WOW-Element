import type { Placement, Options } from '@popperjs/core'
export interface TooltipProps {
  content?: string;
  trigger?: 'hover' | 'click'
  placement?: Placement;
  manual?: boolean;
  // 为了让Options里面的必选参数在此变成可选，需要用Partial
  popperOptions?: Partial<Options>;
  // 动画
  transition?: string;
  // 打开延迟
  openDelay?: number;
  // 关闭延迟
  closeDelay?: number;
}

// 对应的事件
export interface TooltipEmits {
  (e: 'visible-change', value: boolean): void;
  (e: 'click-outside', value: boolean): void;
}

// 要暴露的两个方法，作为给用户进行手动执行的
export interface TooltipInstance {
  show: () => void;
  hide: () => void;
} 