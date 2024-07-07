export function getTimePassed(timestamp) {
    const now = new Date();
    const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    const timestampUTC = new Date(timestamp).getTime();
    const offset = now.getTimezoneOffset() * 60000;
    const difference = nowUTC - timestampUTC - offset;
    let time = Math.round(difference / (1000 * 60)); 
    let entity = 'min';
    if (time >= 60) {
        time = Math.round(time / 60);
        entity = 'h'
        if (time >= 24) {
            time = Math.round(time / 24);
            entity = 'd'
        }
    }
    return [time, entity];
}