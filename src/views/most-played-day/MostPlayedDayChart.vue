<template>
    <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import Chart, { ChartData } from 'chart.js/auto';
import { NowPlayingTrack } from '../../api/NowPlayingTrack';
import { computed, markRaw, onMounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ItemPlayStats } from './ItemPlayStats';

const chart = shallowRef<Chart>();

const props = defineProps<{itemPlayStats: ItemPlayStats[]}>();

watch(() => props.itemPlayStats, (newStats) => {
    if (!chart.value) return;
    updateChart(newStats, chart.value);
});

function updateChart(newStats : ItemPlayStats[], chart: Chart) {

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
    updateChart(props.itemPlayStats, chart.value);
});

</script>