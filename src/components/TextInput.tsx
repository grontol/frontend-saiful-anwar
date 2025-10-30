import { twMerge } from "tailwind-merge"
import { InputLabel } from "./InputLabel"

type Props = {
    type?: "text" | "number"
    value?: string
    onChange?: (v: string) => void
    label?: string
    
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    
    placeholder?: string
    className?: string
}

export function TextInput(props: Props) {
    const disabled = props.disabled ?? false
    const readonly = props.readonly ?? false
    
    return <div
        className={twMerge(
            "flex flex-col",
            props.className,
        )}
    >
        {props.label !== undefined && (
            <InputLabel
                label={props.label}
                required={props.required}
            />
        )}
        
        <div
            className={twMerge(
                "flex bg-white/80 border border-black-extra-light transition-colors rounded focus-within:border-primary",
                readonly ? "bg-white/10" : "",
                disabled ? "bg-gray-400/10" : "",
            )}
        >
            <input
                className="outline-none flex-1 px-3 py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type={props.type ?? "text"}
                value={props.value}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange?.(e.target.value)}
                disabled={disabled}
                readOnly={readonly}
                placeholder={props.placeholder}
            />
        </div>
    </div>
}