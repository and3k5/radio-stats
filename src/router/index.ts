import { createRouter, createWebHashHistory } from 'vue-router';

function parseNumber(value: string | string[] | undefined) : number | undefined {
    if (typeof value === "string") {
        const n = Number(value);
        if (!isNaN(n)) {
            return n;
        }
    }
    return undefined;
}

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            name: "home",
            path: "/",
            redirect(to) {
                return {
                    name: "most-played-day",
                    params: {
                        radioCode: "nov",
                        mode: "chart"
                    }
                }
            },
        },
        {
            name: "most-played-day",
            path: "/most-played-day/:radioCode/:mode/:year?/:month?/:day?",
            component: () => import("../views/most-played-day/MostPlayedDay.vue"),
            props(to) {

                const year = parseNumber(to.params.year);
                const month = parseNumber(to.params.month);
                const day = parseNumber(to.params.day);

                return {
                    code: to.params.radioCode,
                    date: year && month && day ? {
                        year,
                        month,
                        day,
                    } : undefined,
                    mode: to.params.mode,
                }
            }
        }
    ],
})

export default router;