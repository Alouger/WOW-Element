export type AlertType = 'success' | 'info' | 'warning' | 'error'
export type AlertEffect = 'light' | 'dark'

export interface AlertProps {
    // content?: string
    title?: string
    description?: string
    type?: AlertType
    effect?: AlertEffect
    closeable: boolean
    center?: boolean
    showIcon?: boolean
    closeText?: string
}

export interface AlertEvents {
    (e: 'close') : void
}

export interface AlertInstance {
    close: () => void;
}