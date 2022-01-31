
export const UWU_ENDPOINT = "https://kagescan.legtux.org/api/pic.php?noRedirect=true&i="

export async function getUwuUrl(image) : Promise<string>{
    const req = await fetch(UWU_ENDPOINT.concat(image));
    const response = await req.text();
    return response;
}