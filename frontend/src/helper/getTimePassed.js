export function getTimePassed(timestamp) {
    const difference = new Date().getTime() - new Date(timestamp).getTime();
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