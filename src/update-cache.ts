import { addOlderItems } from "./addOlderItems";
import { getCacheStore } from "./caching";
import { updateMostRecent } from "./updateMostRecent";

export const code = process.argv[2];

export const defaultCount = 48;

if (!code) {
    console.error("Please provide a radio code as the first argument.");
    process.exit(1);
    throw new Error("Unreachable");
}

const cache = getCacheStore(`./cache/${code}.json`);

await updateMostRecent(cache);
await addOlderItems(cache);