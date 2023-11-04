import type { Placement } from '@popperjs/core'
export interface TooltipProps {
  content?: string;
  trigger?: 'hover' | 'click'
  placement?: Placement;
}

// 对应的事件
export interface TooltipEmits {
  (e: 'visible-change', value: boolean): void;
}