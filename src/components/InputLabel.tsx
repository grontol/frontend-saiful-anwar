export function InputLabel(props: {
    label: string,
    required?: boolean,
}) {
    return <span
        className="text-sm text-black-medium mb-1.5"
    >
        {props.label}
        
        {props.required && (
            <span className="text-red-500">*</span>
        )}
    </span>
}