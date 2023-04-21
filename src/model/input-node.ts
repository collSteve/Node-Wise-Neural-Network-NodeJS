import { NeuronLink } from "./edge";

export interface InputNodeArgs<T extends NeuronLink> {
    outputEdges?: T[];
}

export class InputNode<T extends NeuronLink> {
    outputEdges: T[];
    outputA: number | null = null;

    constructor(args: InputNodeArgs<T>) {
        this.outputEdges = args.outputEdges ?? [];
    }
}