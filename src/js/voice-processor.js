import {processBlobWithProxy, processText} from "./wit";
import VoiceRecorder from "./voice-recorder";
import Events from "./events";
import speech from "./speech";
import stopwatch from "./stopwatch";
import pageManager from "./page-manager";
import timer from "./timer";

class VoiceProcessor extends Events{

    constructor() {
        super();
    }

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            const audioContext = new AudioContext();
            let source = audioContext.createMediaStreamSource(stream);

            const options = {
                source: source,
                voice_start: () => {
                    console.log('vad_start');
                },
                voice_stop: (blob) => {
                    console.log('vad_stop');

                    processBlobWithProxy(blob)
                        .then(data => this.processNLP(data));
                }
            };

            new VoiceRecorder(options);
        }
        catch (e) {
            console.log(e.message)
        }
    }

    emulate(text) {
        processText(text)
            .then(data => this.processNLP(data)).catch(e => console.log(e));
    }

    processNLP(wit) {
        const entities = wit['entities'];

        if (!entities) {
            return;
        }

        let object = this.getEntityValue(entities, 'object:object', null)
        const operation = this.getEntityValue(entities, 'operation:operation', null)

        if (!object && !operation) {
            return;
        }

        if (!operation) {
            speech.speak("Sorry, I didn't understand that.")
            return;
        }

        if (!object) {
            object = pageManager.getCurrentPage();
        }


        switch (object) {
            case 'stopwatch':
                this.processStopwatchCommands(operation)
                break;

            case 'timer':
                if (wit['intents'].length && wit['intents'][0]['name'] === 'timer_set') {
                    let duration = entities['wit$duration:duration'];
                    if (!duration) {
                        speech.speak("I cannot find the duration for timer");
                        return;
                    }

                    this.processSetTimer(duration);
                    return;
                }

                this.processTimerCommands(operation)
                break;

            case 'todo':
                break;
        }
    }

    convertMsToString(milliseconds) {
        let day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;

        let str = '';
        if (day) {
            str += `${day} days `
        }

        if (hour) {
            str += `${hour} hours `
        }

        if (minute) {
            str += `${minute} minutes `
        }

        if (seconds) {
            str += `${seconds} seconds `
        }

        return str;
    }

    processStopwatchCommands(operation) {
        switch (operation) {
            case 'start':
            case 'resume':
                if (!stopwatch.isActive()) {
                    speech.speak("Starting Stopwatch");
                    stopwatch.start();
                }
                else {
                    speech.speak("Stopwatch is already running");
                }
                break;
            case 'stop':
            case 'pause':
                if (stopwatch.isActive()) {
                    speech.speak("Stopping Stopwatch");
                    stopwatch.stop();
                }
                else {
                    speech.speak("Stopwatch is not running");
                }
                break;
            case 'lap':
                if (stopwatch.isActive()) {
                    speech.speak("Stopwatch lap");
                    stopwatch.lap();
                }
                else {
                    speech.speak("Stopwatch is not running");
                }
                break;
            case 'reset':
            case 'cancel':
                speech.speak("Resetting stopwatch");
                stopwatch.reset();
                break;

            case 'open':
                pageManager.open('stopwatch');
                break;
        }
    }

    processTimerCommands(operation) {
        switch (operation) {
            case 'start':
                if (timer.isActive()) {
                    speech.speak("Timer is already running");
                    return;
                }
                speech.speak("Starting Timer");
                timer.start(timer.getDefaultTime())
                break;

            case 'resume':
                if (timer.isActive() && !timer.isPaused()) {
                    speech.speak("Timer is already running");
                    return;
                }

                speech.speak("Resuming Timer");
                timer.resume();
                break;

            case 'stop':
            case 'pause':
                if (!timer.isActive() || timer.isPaused()) {
                    speech.speak("Timer is not running");
                    return;
                }

                speech.speak("Pausing Timer");
                timer.pause();
                break;

            case 'reset':
            case 'cancel':
                speech.speak("Cancelling timer");
                timer.cancel();
                break;

            case 'open':
                pageManager.open('timer');
                break;
        }
    }

    processSetTimer(duration) {
        if (timer.isActive()) {
            speech.speak("Timer is already running");
            return;
        }

        duration.forEach(v => {
            let value = v['normalized'];

            const multipliers = { second: 1000, hour: 1000, minute: 1000 };
            const multiplier = multipliers[value['unit']] ? multipliers[value['unit']] : 1;

           const time = value['value'] * multiplier;

           const string = this.convertMsToString(time);

           speech.speak(`Setting timer for ${string}`)
           timer.start(time)
        })
    }

    getEntityValue(entities, name, defaultValue = null) {
        return entities[name] && entities[name][0] ? entities[name][0]['value'] : defaultValue;
    }
}

const voiceProcessor = new VoiceProcessor();

window.vp = voiceProcessor;

export default new VoiceProcessor();