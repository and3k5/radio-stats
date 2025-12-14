import { code, defaultCount } from "./update-cache";
import { fetchPlayedItems } from "./api/fetchPlayedItems";
import { NowPlayingTrack } from "./api/NowPlayingTrack";
import { getCacheStore } from "./caching";

export async function updateMostRecent(cache: ReturnType<typeof getCacheStore>) {

    console.log("Adding latest entries...");
    const mostRecent = await cache.getMostRecentItem();
    if (!mostRecent) {
        console.log("  First run: add initial data");
        const items = await fetchPlayedItems(code, new Date(), defaultCount, "    ");
        await cache.appendItems(items);
        console.log("  Initial data added.");
    } else {
        console.log("Adding entries to make cache up to date");
        const itemsToPrepend = [] as NowPlayingTrack[];
        let currentDate = new Date();
        while (true) {
            const items = await fetchPlayedItems(code, currentDate, defaultCount, "  ");
            const overlapIndex = items.findIndex(item => item.nowPlayingTrackId === mostRecent.nowPlayingTrackId && item.nowPlayingTime === mostRecent.nowPlayingTime);
            if (overlapIndex === -1) {
                console.log("  No overlap found yet, fetching older items...");
                itemsToPrepend.push(...items);
                const oldestItem = items[items.length - 1];
                currentDate = new Date(oldestItem.nowPlayingTime);
                //currentDate.setSeconds(currentDate.getSeconds() - 1);
            } else {
                console.log("  Now found overlap at index " + overlapIndex);
                itemsToPrepend.push(...items.slice(0, overlapIndex));
                break;
            }
        }
        await cache.prependItems(itemsToPrepend);
    }
}
