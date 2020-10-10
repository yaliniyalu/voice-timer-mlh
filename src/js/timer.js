import Events from "./events";

class Timer extends Events {
    constructor() {
        super();

        this.startAt = 0;

        this.now = () => {
            return (new Date()).getTime();
        }

        this.clockTimer = null;

        this.totalTime = 0;
        this.elapsedTime = 0;

        this.emitUpdate = false;
    }

    getDefaultTime() {
        return 300000
    }

    start(time) {
        this.reset();

        this.totalTime = time;

        this.startAt = this.now();
        this.clockTimer = setInterval(this.onUpdate.bind(this), 100);

        this.emit('start');
    }

    pause() {
        clearInterval(this.clockTimer);
        this.clockTimer = null;

        this.emit('pause');
    }

    resume() {
        this.startAt = this.now();
        this.clockTimer = setInterval(this.onUpdate.bind(this), 100);

        this.emit('resume');
    }

    cancel() {
        this.reset();
        this.emit('cancel');
    }

    reset() {
        this.startAt = this.elapsedTime = this.totalTime = 0;

        clearTimeout(this.clockTimer);
        this.clockTimer = null;
    }

    isActive() {
        return this.totalTime !== 0
    }

    isPaused() {
        return this.clockTimer === null
    }

    onUpdate() {
        const now = this.now();

        this.elapsedTime += (now - this.startAt);
        this.startAt = now

        if (this.emitUpdate) {
            this.emit('update', this.totalTime - this.elapsedTime);
        }

        if (this.elapsedTime >= this.totalTime) {
            this.reset();

            this.emit('finish');
        }
    }

    startUpdateEvent() {
        this.emitUpdate = true;
    }

    stopUpdateEvent() {
        this.emitUpdate = false
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
        return this.pad(time[0], 2) + ':' + this.pad(time[1], 2) + ':' + this.pad(time[2], 2);
    }
}

export default new Timer();