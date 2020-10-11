<template>
    <f7-page name="stopwatch" class="page-stopwatch">
        <!-- Top Navbar -->
        <f7-navbar :sliding="false">
            <f7-nav-title sliding>Stopwatch</f7-nav-title>
        </f7-navbar>

        <!-- Page content-->
        <f7-block strong>
            <h1 class="text-align-center text-color-primary watch-display">
                <span class="time-hr">{{ display[0] | pad(2) }}</span><span class="time-min">:{{ display[1] | pad(2) }}</span><span class="time-sec">:{{ display[2] | pad(2) }}</span><span class="time-ms text-color-gray">:{{ display[3] | pad(3) }}</span>
            </h1>
        </f7-block>

        <f7-block class="laps-table-block">
            <table class="laps-table">
                <tbody>
                <tr v-for="(lap, index) in laps.slice().reverse()" :key="lap.id">
                    <td class="sno">{{ lap.id }}</td>
                    <td class="time">{{ lap.time | time }}</td>
                    <td class="difference">+ {{ lap.difference | time }}</td>
                </tr>
                </tbody>
            </table>
        </f7-block>

        <f7-block>
            <f7-row>
                <f7-col>
                    <f7-button fill round @click="start" v-if="paused">Start</f7-button>
                    <f7-button fill round @click="stop" v-else>Stop</f7-button>
                </f7-col>
                <f7-col>
                    <f7-button fill round color="blue" @click="reset" v-if="time && paused">Reset</f7-button>
                    <f7-button fill round color="blue" @click="lap" v-else :class="{ disabled: !time }">Lap</f7-button>
                </f7-col>
            </f7-row>
        </f7-block>
    </f7-page>
</template>

<script>
import stopwatch from "../js/stopwatch";

export default {
    name: "Stopwatch",
    filters: {
        time(val) {
            return stopwatch.formatTime(val)
        },
        pad(val, num) {
            return stopwatch.pad(val, num)
        }
    },
    data() {
        return {
            laps: [],
            paused: true,
            time: null,
            lastLapTime: 0,
            display: [0, 0, 0, 0]
        }
    },

    methods: {
        start() {
            stopwatch.start();
        },

        stop() {
            stopwatch.stop();
        },

        reset() {
            stopwatch.reset();
        },

        lap() {
            stopwatch.lap();
        }
    },

    mounted() {
        stopwatch.on('update', time => {
            this.time = time;
            this.display = stopwatch.splitTime(time);
        });
        stopwatch.on('start', _ => {
            this.paused = false;
            stopwatch.startUpdateEvent();
        });

        stopwatch.on('stop', _ => {
            this.paused = true;
            stopwatch.stopUpdateEvent();
        });

        stopwatch.on('reset', _ => {
            this.paused = true;
            this.time = null;
            this.laps = [];
            stopwatch.stopUpdateEvent();
        });

        stopwatch.on('lap', time => {
            this.laps.push({
                id: this.laps.length + 1,
                time: time,
                difference: time - this.lastLapTime
            });
            this.lastLapTime = time;
        });

        if(stopwatch.isActive()) {
            stopwatch.startUpdateEvent();
        }
    },

    beforeDestroy() {
        stopwatch.stopUpdateEvent();
    }
}
</script>

<style scoped>

</style>