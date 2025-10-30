export function rpize(value: number | null): string {
    if (value === null) return ''
    return `Rp. ${thousandSeparator(value)}`
}

export function thousandSeparator(value: number): string {
    const str = value.toString()
    let res = ''
    
    for (let a = 0; a < str.length; a++) {
        if (a > 0 && (str.length - a) % 3 === 0) {
            res += '.'
        }
        
        res += str[a]
    }
    
    return res
}