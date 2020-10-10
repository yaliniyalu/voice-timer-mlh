<template>
    <f7-page name="stopwatch" class="page-stopwatch" @page:beforeremove="onPageBeforeRemove" @page:init="onPageInit">
        <!-- Top Navbar -->
        <f7-navbar :sliding="false">
            <f7-nav-title sliding>Timer</f7-nav-title>
        </f7-navbar>

        <f7-block strong v-show="!active">
            <input type="text" placeholder="Time" readonly="readonly" id="picker-timer" class="text-align-center text-color-primary watch-display" style="width: 100%">
        </f7-block>

        <!-- Page content-->
        <f7-block strong v-if="active">
            <h1 class="text-align-center text-color-primary watch-display">
                <span class="time-hr">{{ display[0] | pad(2) }}</span>
                <span class="time-min">: {{ display[1] | pad(2) }}</span>
                <span class="time-sec">: {{ display[2] | pad(2) }}</span>
            </h1>
        </f7-block>

        <f7-block class="laps-table-block">

        </f7-block>

        <f7-block v-if="!alarm">
            <f7-row>
                <f7-col>
                    <f7-button fill round @click="start" v-if="!active">Start</f7-button>
                    <f7-button fill round @click="cancel" v-else>Cancel</f7-button>
                </f7-col>
                <f7-col>
                    <f7-button fill round color="blue" @click="pause" v-if="!paused || !active" :class="{ disabled: !active }">Pause</f7-button>
                    <f7-button fill round color="blue" @click="resume" v-else>Resume</f7-button>
                </f7-col>
            </f7-row>
        </f7-block>

        <f7-block v-else>
            <f7-row>
                <f7-col>
                    <f7-button fill round @click="stopAlarm">Stop Alarm</f7-button>
                </f7-col>
            </f7-row>
        </f7-block>
    </f7-page>
</template>

<script>
import timer from "../js/timer";

import alarm from "./../assets/alarm.mp3";
const audio = new Audio(alarm);

export default {
    name: "Timer",
    filters: {
        time(val) {
            return timer.formatTime(val)
        },
        pad(val, num) {
            return timer.pad(val, num)
        }
    },
    data() {
        return {
            paused: true,
            active: false,
            display: [0, 0, 0, 0],
            alarm: false,
            alarmHandler: null
        }
    },

    methods: {
        start() {
            const t = this.picker.getValue();
            const time = (parseInt(t[0]) * 3600000) + (parseInt(t[1]) * 60000) + (parseInt(t[2]) * 1000)
            timer.start(time);
        },

        resume() {
            timer.resume();
        },

        pause() {
            timer.pause();
        },

        cancel() {
            timer.cancel();
        },

        stopListeners() {
            timer.off('start pause resume cancel update finish')
        },

        onPageInit(e) {
            this.picker = this.$f7.picker.create({
                inputEl: '#picker-timer',
                toolbar: false,
                rotateEffect: true,
                value: [0, 5, 0,],
                formatValue(values, displayValues) {
                    return `${displayValues[0]} : ${values[1]} : ${values[2]}`;
                },
                cols: [
                    {
                        values: (function createValues() {
                            const arr = [];
                            for (let i = 0; i <= 23; i += 1) {
                                arr.push(i);
                            }
                            return arr;
                        }()),
                    },
                    { divider: true, content: ':',},
                    {
                        values: (function createValues() {
                            const arr = [];
                            for (let i = 0; i <= 59; i += 1) {
                                arr.push(i < 10 ? `0${i}` : i);
                            }
                            return arr;
                        }()),
                    },
                    { divider: true, content: ':',},
                    {
                        values: (function createValues() {
                            const arr = [];
                            for (let i = 0; i <= 59; i += 1) {
                                arr.push(i < 10 ? `0${i}` : i);
                            }
                            return arr;
                        }()),
                    },
                ],
            });
        },
        onPageBeforeRemove() {
            this.picker.destroy();
        },

        startAlarm() {
            this.alarm = true;

            audio.loop = true;
            audio.play();

            this.alarmHandler = setTimeout(() => {
                audio.pause();
                this.alarm = false;
            }, 15 * 1000)
        },

        stopAlarm() {
            audio.pause();
            clearTimeout(this.alarmHandler);
            this.alarmHandler = null;
            this.alarm = false;
        }
    },

    mounted() {
        timer.on('update', time => {
            this.display = timer.splitTime(time);
        });

        timer.on('start', _ => {
            this.paused = false;
            this.active = true;
            timer.startUpdateEvent();
        });

        timer.on('pause', _ => {
            this.paused = true;
            timer.stopUpdateEvent();
        });

        timer.on('resume', _ => {
            this.paused = false;
            timer.startUpdateEvent();
        });

        timer.on('cancel', _ => {
            this.paused = true;
            this.active = false;
            timer.stopUpdateEvent();
        });

        timer.on('finish', _ => {
            this.paused = true;
            this.active = false;
            timer.stopUpdateEvent();
            this.startAlarm();
        });

        if(timer.isActive()) {
            this.paused = timer.isPaused();
            this.active = timer.isActive();
            timer.startUpdateEvent();
        }
    },

    beforeDestroy() {
        timer.stopUpdateEvent();
        this.stopListeners();
    }
}
</script>

<style scoped>

</style>