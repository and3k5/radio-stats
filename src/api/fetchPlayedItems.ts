import { NowPlayingTrack } from "./NowPlayingTrack";

let lastCall = 0;
export async function fetchPlayedItems(radioCode: string, date: Date, count: number, indent = "") {
    if (date.toString() === "Invalid Date") {
        throw new Error("Invalid date provided");
    }
    // https://listenapi.planetradio.co.uk/api9.2/events/nov/2025-12-14%2019%3A33%3A15/100
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log(dateString);

    const url = `https://listenapi.planetradio.co.uk/api9.2/events/${radioCode}/${encodeURIComponent(dateString)}/${count}`;

    console.log(indent+"Fetching api url: " + url);
    if (Date.now() - lastCall < 1100) {
        const waitTime = 1100 - (Date.now() - lastCall);
        console.log(indent+`  Waiting ${waitTime} ms to respect rate limit...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    const response = await fetch(url, { method: "get" });
    const items = (await response.json()) as (NowPlayingTrack | "invalid date")[];
    lastCall = Date.now();
    console.log(indent+"  Fetched " + items.length + " items.");

    return items;
}
