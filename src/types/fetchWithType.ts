export async function fetchWithType<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json() as Promise<T>
}
