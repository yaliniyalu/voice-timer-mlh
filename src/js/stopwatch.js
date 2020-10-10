import Events from "./events";

class Stopwatch extends Events {

    constructor() {
        super();

        this.startAt = 0;
        this.lapTime = 0;

        this.now = () => {
            return (new Date()).getTime();
        }

        this.clockTimer = null;
        this.laps = [];
    }

    start() {
        this.startAt = this.startAt ? this.startAt : this.now();

        this.emit('start');
    }

    stop() {
        this.lapTime = this.startAt ? this.lapTime + this.now() - this.startAt : this.lapTime;
        this.startAt = 0;

        this.emit('stop');
    }

    reset() {
        this.lapTime = this.startAt = 0;
        this.clearLaps();

        this.emit('reset');
    }

    lap() {
        const time = this.getTime();
        this.laps.push(time);

        this.emit('lap', time);
    }

    clearLaps() {
        this.laps = [];

        this.emit('lap-clear');
    }

    getTime() {
        return this.lapTime + (this.startAt ? this.now() - this.startAt : 0);
    }

    isActive() {
        return this.startAt !== 0
    }

    onUpdate() {
        this.emit('update', this.getTime())
    }

    startUpdateEvent(ms = 50) {
        if (this.clockTimer)
            return;

        this.clocktimer = setInterval(this.onUpdate.bind(this), ms);
    }

    stopUpdateEvent() {
        if (this.clockTimer) {
            clearInterval(this.clocktimer);
            this.clockTimer = null;
        }
    }

    pad(num, size) {
        let s = "0000" + num;
        return s.substr(s.length - size);
    }

    splitTime(time) {
        if (time === null) {
            return [0, 0, 0, 0]
        }

        let h, m, s, ms;

        h = Math.floor( time / (60 * 60 * 1000) );
        time = time % (60 * 60 * 1000);
        m = Math.floor( time / (60 * 1000) );
        time = time % (60 * 1000);
        s = Math.floor( time / 1000 );
        ms = time % 1000;

        return [h, m, s, ms]
    }

    formatTime(time) {
        time = this.splitTime(time);
        return this.pad(time[0], 2) + ':' + this.pad(time[1], 2) + ':' + this.pad(time[2], 2) + ':' + this.pad(time[3], 3);
    }
}

export default new Stopwatch();