<template>
    <h2>Most played - day</h2>
    <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 1em;">
        <button type="button" :disabled="prevDate == null" @click="goTo(prevDate)">&lt;</button>
        <select>
            <option v-for="date in availableDates" :key="date" :value="date" :selected="date == currentKey">{{ new Date(date).toLocaleDateString(undefined, { dateStyle: "full"}) }}</option>
        </select>
        <button type="button" :disabled="nextDate == null" @click="goTo(nextDate)">&gt;</button>
    </div>
    <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import Chart, { ChartData } from 'chart.js/auto';
import { NowPlayingTrack } from '../api/NowPlayingTrack';
import { computed, markRaw, onMounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    code: string;
    year: number;
    month: number;
    day: number;
}>();



const playedItems = ref<NowPlayingTrack[]>();
const chart = shallowRef<Chart>();

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

const playedEntries = computed(() => {
    const entries = (playedItems.value ?? []).filter(item => {
        const playedAt = new Date(item.nowPlayingTime);
        return playedAt.getFullYear() === props.year &&
               playedAt.getMonth() + 1 === props.month &&
               playedAt.getDate() === props.day;
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

watch(() => itemPlayStats.value, (newStats) => {
    if (!chart.value) return;
    updateChart(newStats, chart.value);
});

function updateChart(newStats : (typeof itemPlayStats)["value"], chart: Chart) {

    const labels = newStats.slice(0, 10).map(x => x.artist + " - " + x.title);
    
    const playCounts = newStats.slice(0,10).map(x => x.count);

    console.log("Updating chart with new data");
    chart.data.labels = JSON.parse(JSON.stringify(labels));
    chart.data.datasets = JSON.parse(JSON.stringify([{
        label: 'Most played day',
        data: playCounts,
    }]));
    chart.update();
}


const chartCanvas = ref<HTMLCanvasElement>();

const currentKey = computed(() => makeDateKey(new Date(props.year, props.month - 1, props.day)));

const nextDate = computed(() => {
    if (!availableDates.value.includes(currentKey.value)) {
        return undefined;
    }
    
    return availableDates.value[availableDates.value.indexOf(currentKey.value) + 1];
});

const prevDate = computed(() => {
    if (!availableDates.value.includes(currentKey.value)) {
        availableDates.value[availableDates.value.length - 1]
    }
    
    return availableDates.value[availableDates.value.indexOf(currentKey.value) - 1];
});

const router = useRouter();

function goTo(d : undefined | string) {
    if (!d) return;
    const [year, month, day] = d.split("-").map(x => parseInt(x, 10));
    router.replace({
        name: "most-played-day-chart",
        params: {
            code: props.code,
            year: year,
            month: month,
            day: day,
        }
    });
}

onMounted(() => {
    if (chartCanvas.value == null) throw new Error("Canvas not found");
    chart.value = new Chart(chartCanvas.value, {
        type: "bar",
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            responsive: true,
        }
    });
    updateChart(itemPlayStats.value, chart.value);
});

</script>