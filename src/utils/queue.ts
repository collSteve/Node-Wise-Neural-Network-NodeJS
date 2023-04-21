export class Queue<T> {
    elements: T[] = [];

    constructor() {
        this.elements = [];
    }
    enqueue(element: T) {
        this.elements.push(element);
    }
    dequeue(): T | undefined {
        const item = this.elements.shift();
        return item;
    }
    peek(): T | undefined {
        return this.elements[0];
    }
    get length() {
        return this.elements.length;
    }
    get isEmpty() {
        return this.length === 0;
    }
}
