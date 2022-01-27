// Standard variation
export async function fetchWithType<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json() as Promise<T>
}


export interface descalendrierEdt {
    classes: string[],
    timed: boolean,
    enseignant: string,
    location: string,
    name: string,
    start: string,
    end: string,
    lastmodified: string,
    dtstamp: string
}
export interface descalendrierCategory {
    titre: string,
    icone: string,
    groupes: {
        titre: string,
        edt: descalendrierEdt[]
    }[]
}

// deno-lint-ignore no-empty-interface
export interface descalendrierGroupes extends Array<descalendrierCategory>{}

export function getDescalendrier(): Promise<descalendrierGroupes> {
    return fetchWithType<descalendrierGroupes>("https://descalendrier.jiveoff.fr/api/groupes");
}