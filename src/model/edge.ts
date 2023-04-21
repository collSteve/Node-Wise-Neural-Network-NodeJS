import { arraySum } from "../utils/sum";
import { InputNode } from "./input-node";
import { NeuronNode } from "./node";
import { OutputNode } from "./out-put-node";

export interface NeuronLinkArgs<T extends NeuronLink = NeuronLink> {
    fromNeuron: NeuronNode | InputNode<T>;
    toNeuron: NeuronNode | OutputNode;
    weight: number;
}

export class NeuronLink {
    fromNeuron: NeuronNode | InputNode<NeuronLink>;
    toNeuron: NeuronNode | OutputNode;

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
