import Events from "./events";

class Speech extends Events{
    constructor() {
        super();
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);

        utterance.addEventListener('start', event => {
            this.emit('start', event)
        });

        utterance.addEventListener('end', event => {
            this.emit('end', event)
        });
    }
}


export default new Speech();