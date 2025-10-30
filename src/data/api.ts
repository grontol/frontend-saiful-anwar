const baseUrl = " http://202.157.176.100:3001/"

const cachedData: Record<string, any> = {}

export async function apiGet<T>(path: string, allowCache = true): Promise<T> {
    if (allowCache && path in cachedData) {
        return cachedData[path]
    }
    
    const url = new URL(path, baseUrl)
    
    const res = await fetch(url.href, {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    })
    
    const json = await res.json()
    
    if (allowCache) {
        cachedData[path] = json
    }
    
    console.log(`[GET] ${path}`)
    console.log(json)
    
    return json
}