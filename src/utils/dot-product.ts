export function rowDotProduct(x: number[], y: number[]) {
    if (x.length !== y.length) {
        throw new Error(
            `[Dot Product]: expect vector of same length but get ${x.length} vs ${y.length} instead.`
        );
    }
    let product = 0;
    for (let i = 0; i < x.length; i++) {
        product = x[i] * y[i];
    }

    return product;
}
