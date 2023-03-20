import { NeuronLink } from "./edge";

export interface OutputNodeArgs {
    inputEdges?: NeuronLink[];
}

export class OutputNode {
    inputEdges: NeuronLink[];
    outputA: number | null = null;

    constructor(args: OutputNodeArgs) {
        this.inputEdges = args.inputEdges ?? [];
    }
}