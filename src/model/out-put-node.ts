import { NeuronLink } from "./edge";
import { NeuronNode, NeuronNodeArgs } from "./node";

export interface OutputNodeArgs extends NeuronNodeArgs {
    
}

export class OutputNode extends NeuronNode {
    outputA: number | null = null;

    constructor(args: OutputNodeArgs) {
        super(args);
        this.outputEdges = []; // no output edge
    }
}