import { rowDotProduct } from "../utils/dot-product";
import { DirectedEdge } from "./edge";

export function defaultComputationFunction(weights: number[], inputAs: number[], bias: number): number {

    return rowDotProduct(weights, inputAs) + bias;
}

export interface NodeArgs {
    activationInfo: ActivationInfo;
    inputEdges?: DirectedEdge[];
    outputEdge?: DirectedEdge[];
    bias?: number;
}

export interface ActivationInfo {
    activationFunction: (x:number) => number;
    activationFunctionDiff: (x:number) => number;
}

export class Node {
    inputEdge: DirectedEdge[];
    outputEdge: DirectedEdge[];

    bias: number;
    computationFunction: (weights: number[], inputAs: number[], bias: number) => number = defaultComputationFunction;
    activationInfo: ActivationInfo;
    outputA: number | null = null;

    constructor(args: NodeArgs) {
        this.activationInfo = args.activationInfo;

        this.inputEdge = args.inputEdges ?? [];
        this.outputEdge = args.outputEdge ?? [];
        this.bias = args.bias ?? 0;
    }
}