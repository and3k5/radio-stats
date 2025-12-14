import { mkdir, readFile, writeFile } from "fs/promises";
import { NowPlayingTrack } from "../api/NowPlayingTrack";
import { existsSync } from "fs";
import { dirname } from "path";

export function getCacheStore(path: string) {
    
    return {
        async getMostRecentItem() {
            const data = await readContent(path);
            return data[0];
        },
        async getOldestItem() {
            const data = await readContent(path);
            return data[data.length - 1];
        },
        async appendItems(items: NowPlayingTrack[], indent = "") {
            const existing = await readContent(path);
            const combined = [...existing, ...items];
            await writeContent(path, combined);
            console.log(indent+"Appended " + items.length + " items.");
        },
        async prependItems(items: NowPlayingTrack[], indent = "") {
            const existing = await readContent(path);
            const combined = [...items, ...existing];
            await writeContent(path, combined);
            console.log(indent+"Prepended " + items.length + " items.");
        }
    }
}

async function readContent(path: string) {
    if (!existsSync(path)) {
        console.debug("Reading cache: Cache doesn't exist. Return empty array for " + path);
        return [] as NowPlayingTrack[];
    }
    console.debug("Reading cache: From file " + path);
    const content = await readFile(path, { encoding: "utf-8" });
    return JSON.parse(content) as NowPlayingTrack[];
}

async function writeContent(path: string, data: NowPlayingTrack[]) {
    console.debug("Writing cache to file " + path);
    if (!existsSync(dirname(path))) {
        await mkdir(dirname(path), { recursive: true });
    }
    const content = JSON.stringify(data, null, 4);
    await writeFile(path, content, { encoding: "utf-8" });
}