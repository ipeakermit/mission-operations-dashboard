export function generateRandom(min, max, decimals) {
    return (((Math.random() + Math.random() + Math.random())/3) * (max - min) + min).toFixed(decimals);
}

export function decreaseValue(value, min, max, decimals) {
    let decrease = ((Math.random() + Math.random() + Math.random())/3) * (max - min) + min;
    return parseFloat((value - decrease).toFixed(decimals));
}

export function increaseValue(value, min, max, decimals) {
    let increase = ((Math.random() + Math.random() + Math.random())/3) * (max - min) + min;
    return parseFloat((value + increase).toFixed(decimals));
}