import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

// 直接把FontAwesomeIconProps的属性拷贝过来
export interface IconProps {
    border?: boolean
    fixedWidth?: boolean
    flip?: 'horizontal' | 'vertical' | 'both'
    icon: object | Array<string> | string | IconDefinition
    mask?: object | Array<string> | string
    listItem?: boolean
    pull?: 'right' | 'left'
    pulse?: boolean
    rotation?: 90 | 180 | 270 | '90' | '180' | '270'
    swapOpacity?: boolean
    size?: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x'
    spin?: boolean
    transform?: object | string
    symbol?: boolean | string
    title?: string
    inverse?: boolean
    bounce?: boolean
    shake?: boolean
    beat?: boolean
    fade?: boolean
    beatFade?: boolean
    spinPulse?: boolean
    spinReverse?: boolean
    // 我们自己添加的自定义属性
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    // 我们自己添加的自定义属性
    color?: string 
}