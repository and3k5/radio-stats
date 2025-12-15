<template>
    <div class="container-fluid">
        <h2>Most played - day</h2>
        <div class="btn-group mb-3">
            <button :class="{'btn': true, 'btn-secondary': mode === 'list', 'btn-outline-secondary': mode !== 'list'}" type="button" @click="goTo(currentKey, 'list')" :disabled="mode === 'list'">List</button>
            <button :class="{'btn': true, 'btn-secondary': mode === 'chart', 'btn-outline-secondary': mode !== 'chart'}" type="button" @click="goTo(currentKey, 'chart')" :disabled="mode === 'chart'">Chart</button>
        </div>

        <div class="input-group mb-3">
            <button class="btn btn-secondary" type="button" :disabled="prevDate == null" @click="goTo(prevDate, mode)">&lt;</button>
            <select class="form-select">
                <option v-for="date in availableDates" :key="date" :value="date" :selected="date == currentKey">{{ new Date(date).toLocaleDateString(undefined, { dateStyle: "full"}) }}</option>
            </select>
            <button class="btn btn-secondary" type="button" :disabled="nextDate == null" @click="goTo(nextDate, mode)">&gt;</button>
        </div>

        <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 1em;">
            
            
        </div>
        <Component :is="props.mode === 'chart' ? ChartView : ListView" :itemPlayStats="itemPlayStats"></Component>
    </div>
</template>

<script setup lang="ts">
import { NowPlayingTrack } from '../../api/NowPlayingTrack';
import { computed, defineAsyncComponent, markRaw, onMounted, ref, shallowRef, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';
const ChartView = defineAsyncComponent(() => import('./MostPlayedDayChart.vue'));
const ListView = defineAsyncComponent(() => import('./MostPlayedDayList.vue'));

const props = defineProps<{
    mode: "chart" | "list";
    code: string;
    date? : undefined | {
        year: number;
        month: number;
        day: number;
    }
}>();

const playedItems = ref<NowPlayingTrack[]>();

fetch("/cache/"+props.code+".json").then(res => res.json()).then(data => {
    playedItems.value = data;
    console.log(playedItems.value);
});

function makeDateKey(date : Date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
}

const availableDates = computed(() => {
    const datesSet = new Set<string>();
    if (playedItems.value) {
        playedItems.value.forEach(item => {
            const playedAt = new Date(item.nowPlayingTime);
            const dateKey = makeDateKey(playedAt);
            if (datesSet.has(dateKey)) return;
            datesSet.add(dateKey);
        });
    }
    return Array.from(datesSet.keys()).sort((a, b) => {
        const [aYear, aMonth, aDay] = a.split("-").map(x => parseInt(x, 10));
        const [bYear, bMonth, bDay] = b.split("-").map(x => parseInt(x, 10));
        if (aYear !== bYear) return aYear - bYear;
        if (aMonth !== bMonth) return aMonth - bMonth;
        return aDay - bDay;
    });
})

function dateStringToParts(str : string | undefined | null) {
    if (!str) return undefined;
    const [year, month, day] = str.substring(0, 10).split("-").map(x => parseInt(x, 10));
    return { year, month, day };
}

const dateValue = computed(() => {
    return props.date ?? dateStringToParts(playedItems.value?.find(x => true)?.nowPlayingTime);

});

const playedEntries = computed(() => {
    const date = dateValue.value;
    
    if (!date || !playedItems.value) return [];

    const entries = (playedItems.value ?? []).filter(item => {
        const playedAt = new Date(item.nowPlayingTime);
        return playedAt.getFullYear() === date.year &&
               playedAt.getMonth() + 1 === date.month &&
               playedAt.getDate() === date.day;
    });
    return entries;
});

const itemPlayStats = computed(() => {

    const groupedById = playedEntries.value.reduce((acc, item) => {
        const key = item.nowPlayingTrackId;
        let match = acc.find(x => x.id === key);
        if (!match) {
            match = {
                id: key,
                count: 0,
                title: item.nowPlayingTrack,
                artist: item.nowPlayingArtist,
            };
            acc.push(match);
        }
        match.count += 1;
        return acc;
    }, [] as { id: number, count: number; title: string; artist: string }[])
        .sort((a, b) => b.count - a.count);

    return groupedById;
})

const currentKey = computed(() => dateValue.value ? makeDateKey(new Date(dateValue.value.year, dateValue.value.month - 1, dateValue.value.day)) : undefined);

const nextDate = computed(() => {
    if (!currentKey.value) return undefined;
    if (!availableDates.value.includes(currentKey.value)) {
        return undefined;
    }
    
    return availableDates.value[availableDates.value.indexOf(currentKey.value) + 1];
});

const prevDate = computed(() => {
    if (!currentKey.value) return undefined;
    if (!availableDates.value.includes(currentKey.value)) {
        availableDates.value[availableDates.value.length - 1]
    }
    
    return availableDates.value[availableDates.value.indexOf(currentKey.value) - 1];
});

const router = useRouter();

function goTo(d : undefined | string, mode : string) {
    if (!d) return;
    const [year, month, day] = d.split("-").map(x => parseInt(x, 10));
    router.replace({
        name: "most-played-day",
        params: {
            code: props.code,
            mode: mode,
            year: year,
            month: month,
            day: day,
        }
    });
}


</script>