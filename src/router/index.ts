import { createRouter, createWebHashHistory } from 'vue-router';
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            name: "home",
            path: "/",
            redirect(to) {
                return {
                    name: "most-played-day-chart",
                    params: {
                        radioCode: "nov",
                        year: new Date().getFullYear(),
                        month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
                        day: (new Date().getDate()).toString().padStart(2, '0'),
                    }
                }
            },
        },
        {
            name: "most-played-day-chart",
            path: "/most-played-day/chart/:radioCode/:year/:month/:day",
            component: () => import("../views/MostPlayedDayChart.vue"),
            props(to) {
                return {
                    code: to.params.radioCode,
                    year: Number(to.params.year),
                    month: Number(to.params.month),
                    day: Number(to.params.day),
                }
            }
        },
        {
            name: "most-played-day-list",
            path: "/most-played-day/list/:radioCode/:year/:month/:day",
            component: () => import("../views/MostPlayedDayList.vue"),
            props(to) {
                return {
                    code: to.params.radioCode,
                    year: Number(to.params.year),
                    month: Number(to.params.month),
                    day: Number(to.params.day),
                }
            }
        },
    ],
})

export default router;