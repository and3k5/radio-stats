<template>
    <header>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="javascript:void(0)">Radio stats</a>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div
                    class="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <RouterLink :to="{name: 'home'}" custom v-slot="{href, isActive, navigate}"><a
                                :class="{'nav-link': true, 'active': isActive }"
                                :aria-current="isActive ? 'page' : undefined"
                                :href="href"
                                @click="navigate"
                                >Home</a
                            ></RouterLink>
                        </li>
                        <li class="nav-item dropdown">
                            <a
                                class="nav-link dropdown-toggle"
                                href="javascript:void(0)"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Most played day
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <RouterLink :to="{name: 'most-played-day', params: {mode: 'list', radioCode: 'nov'}}" custom v-slot="{href, isActive, navigate}"><a
                                        :class="{'dropdown-item': true}"
                                        :href="href"
                                        @click="navigate"
                                        >List</a
                                    ></RouterLink>
                                </li>
                                <li>
                                    <RouterLink :to="{name: 'most-played-day', params: {mode: 'chart', radioCode: 'nov'}}" custom v-slot="{href, isActive, navigate}"><a
                                        :class="{'dropdown-item': true}"
                                        :href="href"
                                        @click="navigate"
                                        >Chart</a
                                    ></RouterLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <RouterView></RouterView>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>
