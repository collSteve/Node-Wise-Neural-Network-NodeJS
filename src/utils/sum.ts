export function arraySum(v: number[]): number {
    let re = 0;
    for (let i=0; i<v.length; i++) {
        re += v[i];
    }
    return re;
}