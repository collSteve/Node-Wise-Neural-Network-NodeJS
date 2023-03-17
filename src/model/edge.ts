import { arraySum } from "../utils/sum";
import { NeuronNode } from "./node";

export interface NeuronLinkArgs {
    fromNeuron: NeuronNode;
    toNeuron: NeuronNode;
    weight: number;
}

export class NeuronLink {
    fromNeuron: NeuronNode;
    toNeuron: NeuronNode;

    weight: number;

    deltaError: number | null = null;

    deltaStorage: { weightDeltas: number[]; deltaErrorDeltas: number[] } = {
        weightDeltas: [],
        deltaErrorDeltas: [],
    };

    constructor(args: NeuronLinkArgs) {
        this.fromNeuron = args.fromNeuron;
        this.toNeuron = args.toNeuron;
        this.weight = args.weight;
    }

    get toNodeOutputA(): number | null {
        return this.toNeuron.outputA;
    }

    get fromNodeOutputA(): number | null {
        return this.fromNeuron.outputA;
    }

    applyDelta() {
        this.weight += arraySum(this.deltaStorage.weightDeltas);
        this.deltaError = arraySum(this.deltaStorage.weightDeltas);
    }
}
