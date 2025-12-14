import { code, defaultCount } from "./update-cache";
import { fetchPlayedItems } from "./api/fetchPlayedItems";
import { getCacheStore } from "./caching";

export async function addOlderItems(cache: ReturnType<typeof getCacheStore>) {
    console.log("Adding older entries");
    while (true) {
        const oldestItem = await cache.getOldestItem();
        if (oldestItem == null) {
            throw new Error("no stored items");
        }
        console.log("  Going back before " + oldestItem.nowPlayingTime);
        if (!oldestItem) {
            throw new Error("no stored items");
        }
        const items = await fetchPlayedItems(code, new Date(oldestItem.nowPlayingTime), defaultCount);
        if (items.length === 0) {
            console.log("  No more older items found, stopping.");
            break;
        }
        if (items.every(i => i === "invalid date")) {
            console.log("  Received invalid date items, stopping.");
            break;
        }
        
        if (items.some(x => x !== "invalid date")) {
            const validItems = items.filter((x): x is Exclude<typeof x, "invalid date"> => x !== "invalid date");
            await cache.appendItems(validItems, "    ");
        }

        if (items.some(x => x === "invalid date")) {
            console.log("  Some items were invalid date, stopping.");
            break;
        }
    }
}
