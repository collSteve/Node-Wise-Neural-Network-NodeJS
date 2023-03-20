import { NeuronLink } from "./edge";

export interface InputNodeArgs {
    outputEdges?: NeuronLink[];
}

export class InputNode {
    outputEdges: NeuronLink[];
    outputA: number | null = null;

    constructor(args: InputNodeArgs) {
        this.outputEdges = args.outputEdges ?? [];
    }
}