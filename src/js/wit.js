
process.env.WIT_CLIENT_TOKEN = "MGFRHGQXQPBFO2SUB2FRQDCLKRAC4HRX";

function processBlob(blob) {
    return fetch('https://api.wit.ai/speech?v=20200817', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'audio/wav',
            'Authorization': `Bearer ${process.env.WIT_CLIENT_TOKEN}`
        },
        body: blob
    })
        .then(response => response.json());
}

function processText(text) {
    return fetch('https://api.wit.ai/message?v=20200817&q=' + text, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${process.env.WIT_CLIENT_TOKEN}`
        }
    })
        .then(response => response.json());
}

export {
    processBlob,
    processText
};
