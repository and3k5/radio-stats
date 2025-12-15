<template>
    <ul style="font-size:35pt;">
        <li v-for="item in itemPlayStats">{{ item.artist }} - {{ item.title }} <strong>x{{ item.count }}</strong></li>
    </ul>
</template>

<script setup lang="ts">
import { ItemPlayStats } from './ItemPlayStats';

const props = defineProps<{itemPlayStats: ItemPlayStats[]}>();
</script>