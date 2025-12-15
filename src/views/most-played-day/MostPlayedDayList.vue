<template>
    <ol class="list-group list-group-numbered">
        <li 
            v-for="item in itemPlayStats"
            :key="item.id"
            class="list-group-item d-flex justify-content-between align-items-start"
        >
            <div class="ms-2 me-auto">
                <div class="fw-bold">{{ item.title }}</div>
                {{ item.artist }}
            </div>
            <span class="badge text-bg-primary rounded-pill">x{{ item.count }}</span>
        </li>
    </ol>
</template>

<script setup lang="ts">
import { ItemPlayStats } from "./ItemPlayStats";

const props = defineProps<{ itemPlayStats: ItemPlayStats[] }>();
</script>
