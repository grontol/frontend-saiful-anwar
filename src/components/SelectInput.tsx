import { useEffect, useMemo, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { InputLabel } from "./InputLabel"
import { Button } from "./Button"
import { stop } from "./event_utils"

export type OptionItem<T = string> = {
    text: string
    value: T
}

type Option<T> = T | OptionItem<T>

type Props<T> = {
    options: readonly Option<T>[]
    value: T
    label?: string
    onChange?: (v: T) => void
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    placeholder?: string
    searchable?: boolean
    clearable?: boolean
    className?: string
}

export function SelectInput<T extends string | number = string>(props: Props<T>) {
    const el = useRef<HTMLDivElement>(null)
    
    const disabled = props.disabled ?? false
    const readonly = props.readonly ?? false
    const searchable = props.searchable ?? true
    const clearable = props.clearable ?? true
    
    const [isShowOptions, setIsShowOptions] = useState(false)
    const isSearching = searchable && !disabled && isShowOptions
    const [searchText, setSearchText] = useState("")
    
    const text = useMemo(() => {
        const selected = props.options.find(x => getValueOf(x) === props.value)
        
        if (!selected) {
            return ""
        }
        else {
            return getTextOf(selected)
        }
    }, [props.options, props.value])
    
    const inputText = useMemo(() => {
        if (isSearching) {
            return searchText
        }
        else {
            return text
        }
    }, [isSearching, searchText, text])
    
    const placeholder = useMemo(() => {
        if (isSearching) {
            return text
        }
        else {
            return props.placeholder
        }
    }, [isSearching, props.placeholder, text])
    
    const filteredOptions = useMemo(() => {
        if (!searchable || !searchText) return props.options
        
        return props.options.filter(x => {
            const text = getTextOf(x)
            return text.toLowerCase().includes(searchText.toLowerCase())
        })
    }, [props.options, searchText, searchable])
    
    const selectedIndex = useMemo(() => {
        return filteredOptions.findIndex(x => getValueOf(x) === props.value)
    }, [filteredOptions, props.value])
    
    function showOptions(toggle = false) {
        if (readonly || disabled) return
        
        if (toggle) {
            setIsShowOptions(!isShowOptions)
        }
        else {
            setIsShowOptions(true)
        }
    }
    
    function hideOptions() {
        setIsShowOptions(false)
        setSearchText("")
    }
    
    function selectOption(option: Option<T>, hide = true) {
        props.onChange?.(getValueOf(option))
        
        if (hide) {
            hideOptions()
        }
    }
    
    function handleClickOutside(event: MouseEvent) {
        if (event.target instanceof Node && !el.current?.contains(event.target)) {
            hideOptions()
        }
    }
    
    function clear() {
        if (typeof props.value === 'number') {
            props.onChange?.(0 as T)
        }
        else {
            props.onChange?.('' as T)
        }
    }
    
    function keyDownHandler(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.code === "ArrowDown") {
            if (selectedIndex < filteredOptions.length - 1) {
                selectOption(filteredOptions[selectedIndex + 1], false)
            }
        }
        else if (e.code === "ArrowUp") {
            if (selectedIndex > 0) {
                selectOption(filteredOptions[selectedIndex - 1], false)
            }
        }
        else if (e.code === "Enter") {
            if (isShowOptions) {
                hideOptions()
            }
        }
        else if (e.code === "Escape") {
            if (isShowOptions) {
                hideOptions()
            }
        }
    }
    
    useEffect(() => {
        document.addEventListener("click", handleClickOutside)
        
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <div
            className={twMerge(
                "flex flex-col relative",
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
                ref={el}
                className={twMerge(
                    "flex flex-col bg-white/80 border border-black-extra-light transition-colors rounded relative focus-within:border-primary",
                    readonly ? "bg-white/10" : "",
                    disabled ? "bg-gray-400/10" : "",
                )}
            >
                <input
                    type="text"
                    className={twMerge(
                        "outline-none px-3 py-1.5 cursor-pointer",
                        disabled ? "cursor-default" : "",
                    )}
                    onFocus={() => showOptions(false)}
                    onClick={() => showOptions(false)}
                    value={inputText}
                    onInput={(v: React.ChangeEvent<HTMLInputElement>) => setSearchText(v.target.value)}
                    readOnly={!isSearching}
                    placeholder={placeholder}
                    disabled={disabled}
                    onKeyDown={keyDownHandler}
                />
                
                <div
                    className="absolute top-0 bottom-0 right-1 flex items-center"
                >
                    {clearable && !readonly && !disabled && props.value && (
                        <Button
                            color="neutral"
                            style="none"
                            onClick={stop(clear)}
                            noFocus={true}
                        >
                            <span className="icon-[ant-design--close-outlined] text-black-medium"/>
                        </Button>
                    )}
                    
                    <span
                        className={twMerge(
                            "icon-[solar--alt-arrow-down-line-duotone] text-black-medium",
                            props.disabled ? "" : "cursor-pointer"
                        )}
                        onClick={() => showOptions(true)}
                    />
                </div>
                
                {isShowOptions && (
                    <div
                        className="absolute top-full mt-1 z-100 bg-white-darker flex flex-col w-full disable-break py-2 border border-black-extra-light box-border overflow-auto rounded max-h-[500px]"
                    >                        
                        {filteredOptions.map((option, i) => (
                            <div
                                className={twMerge(
                                    "hover:bg-black/10 px-4 py-1 cursor-pointer",
                                    i === selectedIndex ? "bg-primary/20" : ""
                                )}
                                onClick={stop(() => selectOption(option))}
                                key={getValueOf(option)}
                            >{getTextOf(option)}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function getValueOf<T>(option: Option<T>): T {
    if (isOptionItem(option)) {
        return option.value
    }
    else {
        return option
    }
}

function getTextOf<T extends string | number>(option: Option<T>): string {
    if (isOptionItem(option)) {
        return option.text
    }
    else {
        return option.toString()
    }
}

function isOptionItem<T>(item: Option<T>): item is OptionItem<T> {
    return typeof item === "object" && item && "text" in item && "value" in item
}