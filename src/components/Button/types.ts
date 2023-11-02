// Button 属性列表 (都传，没有的话就传默认值)：
// type：不同的样式 (Primary, Danger, Info, Success, Warning)
// plain: 样式的不同展现模式 boolean
// round：圆角 boolean
// circle：圆形按钮，适合图标 boolean
// size: 不同大小 (small/normal/large)
// disabled：禁用 boolean
// 图标：后面再添加
// *loading：*后面再添加

// type 类型别名
export type ButtonType = 'primary' | 'danger' | 'info' | 'success' | 'warning'
// 还有一个类型值是normal，当我们不传ButtonSize时，默认值就是normal
export type ButtonSize = 'small' | 'large'
export type NativeType = 'button' | 'submit' | 'reset'
// 该接口描述一个button实例具体是什么样的
export interface ButtonInstance {
  ref: HTMLButtonElement
}
// ?表示可选项，不是必需项
export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  plain?: boolean
  round?: boolean
  circle?: boolean
  disabled?: boolean
  nativeType?: NativeType
  autofocus?: boolean
  icon?: string
  loading?: boolean
}
