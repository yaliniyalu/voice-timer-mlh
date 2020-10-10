
export default class Events {
    constructor () {
        this.events = {};
    }

    on (evt, callback) {
        if (!this.events[evt]) {
            this.events[evt] = [];
        }

        this.events[evt].push(callback);
        return this;
    }

    off (evt, callback) {
        const events = evt.split(' ');

        events.forEach(evt => {
            if (!this.events[evt]) {
                return;
            }

            let index = this.events[evt].indexOf(callback);
            if (index > -1) {
                this.events[evt].splice(index, 1);
            }
        })

        return this;
    }

    emit (evt, ...data) {
        if (!this.events[evt]) {
            return;
        }

        this.events[evt].forEach((fn) => {
            fn.call(this, ...data);
        })
    }
}
