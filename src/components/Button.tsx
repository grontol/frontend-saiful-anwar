import { twMerge } from "tailwind-merge"

type Props = {
    onClick?: () => void
    children?: React.ReactNode
    className?: string
    
    size?: "sm" | "md" | "lg"
    style?: "fill" | "outline" | "none"
    color?: "primary" | "secondary" | "warning" | "error" | "neutral"
    
    disabled?: boolean
    type?: "button" | "submit" | "reset"
    noFocus?: boolean
}

export function Button(props: Props) {
    const size = props.size ?? "md"
    const style = props.style ?? "fill"
    const color = props.color ?? "primary"
    
    const background = (() => {
        if (style === 'fill') {
            if (color === 'primary') return "bg-primary border border-transparent text-white"
            else if (color === 'secondary') return "bg-secondary border border-transparent text-white"
            else if (color === 'warning') return "bg-warning border border-transparent text-white"
            else if (color === 'error') return "bg-error border border-transparent text-white"
            else return "bg-text-medium/20 border border-transparent text-white"
        }
        else if (style === 'outline') {
            if (color === 'primary') return "border border-primary text-primary"
            else if (color === 'secondary') return "border border-secondary text-secondary"
            else if (color === 'warning') return "border border-warning text-warning"
            else if (color === 'error') return "border border-error text-error"
            else return "border border-text-medium text-text-medium"
        }
        else {
            if (color === 'primary') return "text-primary border border-transparent"
            else if (color === 'secondary') return "text-secondary border border-transparent"
            else if (color === 'warning') return "text-warning border border-transparent"
            else if (color === 'error') return "text-error border border-transparent"
            else return "text-text-medium border border-transparent"
        }
    })()
    
    return (
        <button
            type={props.type ?? "button"}
            className={twMerge(
                background,
                "rounded cursor-pointer hover:brightness-110 active:brightness-125 flex justify-center items-center",
                size === "sm" ? "px-1.5 py-0.5 text-sm" : size === "lg" ? "px-3 py-1.5 text-lg" : "px-2 py-1",
                props.disabled ? "brightness-145 hover:brightness-145 active:brightness-145 cursor-not-allowed" : "",
                props.className,
            )}
            onClick={props.onClick}
            tabIndex={props.noFocus ? -1 : undefined}
        >{props.children}</button>
    )
}

export function ToggleButton(props: {
    value: boolean
    onChange?: (value: boolean) => void
    class?: string
}) {
    return <div 
        className={twMerge(
            "p-1 rounded-full h-8 w-16 cursor-pointer relative",
            props.value ? "bg-green-500" : "bg-gray-500",
            props.class,
        )}
        onClick={() => props.onChange?.(!props.value)}
    >
        <div className={twMerge(
            "w-6 h-6 rounded-full bg-white absolute top-1 transition-all ease-in-out",
            props.value ? "left-9" : "left-1"
        )}/>
    </div>
}