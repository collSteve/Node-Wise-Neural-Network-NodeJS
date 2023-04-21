import { rowDotProduct } from "../utils/dot-product";
import { arraySum } from "../utils/sum";
import { NeuronLink } from "./edge";

export function defaultComputationFunction(
    weights: number[],
    inputAs: number[],
    bias: number
): number {
    return rowDotProduct(weights, inputAs) + bias;
}

export interface NeuronNodeArgs {
    activationInfo: ActivationInfo;
    inputEdges?: NeuronLink[];
    outputEdges?: NeuronLink[];
    bias?: number;
}

export interface ActivationInfo {
    activationFunction: (x: number) => number;
    activationFunctionDiff: (x: number) => number;
}

export class NeuronNode {
    inputEdges: NeuronLink[];
    outputEdges: NeuronLink[];

    bias: number;
    computationFunction: (
        weights: number[],
        inputAs: number[],
        bias: number
    ) => number = defaultComputationFunction;
    activationInfo: ActivationInfo;
    outputA: number | null = null;

    deltaStorage: {biasDeltas: number[]} = {biasDeltas: []};

    constructor(args: NeuronNodeArgs) {
        this.activationInfo = args.activationInfo;

        this.inputEdges = args.inputEdges ?? [];
        this.outputEdges = args.outputEdges ?? [];
        this.bias = args.bias ?? 0;
    }

    deltasCalculation(): {
        deltaBias: number;
        deltaWeightsVector: number[];
        deltaErrorsVector: number[];
    } {
        // dEc = sum(oDEm) over all m; oDEm: outputDEs
        let currentError = 0;
        for (const edge of this.outputEdges) {
            if (edge.deltaError == null) {
                throw new Error("Not all output edges has error calculated.");
            }
            currentError += edge.deltaError;
        }

        // calculate z
        const inputOutputAs = this.inputOuputAs;
        if (inputOutputAs.some((x) => x == null)) {
            throw new Error("Not all input output-As are calculated.");
        }
        const z = this.computationFunction(
            this.inputWeights,
            inputOutputAs as number[],
            this.bias
        );

        // calculate d(activation(z))/dz
        const diffActZ = this.activationInfo.activationFunctionDiff(z);

        //iDb = dEc * d(activation(z))/dz
        const deltaBias = currentError * diffActZ;

        const deltaWeightsVector = [];
        const deltaErrorsVector = [];
        for (const edge of this.inputEdges) {
            // idWn = dEc * d(activation(z))/dz * iAn
            deltaWeightsVector.push(
                currentError * diffActZ * (edge.fromNodeOutputA as number)
            );

            // iDEn = dEc * d(activation(z))/dz * iWn
            deltaErrorsVector.push(currentError * diffActZ * edge.weight);
        }

        return { deltaBias, deltaWeightsVector, deltaErrorsVector };
    }

    sentDeltas() {
        const { deltaBias, deltaWeightsVector, deltaErrorsVector } = this.deltasCalculation();
        this.deltaStorage.biasDeltas.push(deltaBias);

        for (let i = 0; i < this.inputEdges.length; i++) {
            const edge = this.inputEdges[i];
            const deltaWeight = deltaWeightsVector[i];
            const deltaError = deltaErrorsVector[i];

            edge.deltaStorage.deltaErrorDeltas.push(deltaError);
            edge.deltaStorage.weightDeltas.push(deltaWeight);
        }
    }

    applyDelta() {
        this.bias += arraySum(this.deltaStorage.biasDeltas);
    }

    calculateOutputA(weights: number[], fromNeuronsOutputAs: number[]) {
        this.outputA = this.computationFunction(weights, fromNeuronsOutputAs, this.bias);
    }

    get allOutputEdgesErrorCalculated(): boolean {
        for (const edge of this.outputEdges) {
            if (edge.deltaError == null) {
                return false;
            }
        }
        return true;
    }

    get inputWeights(): number[] {
        const weights = [];
        for (const edge of this.inputEdges) {
            weights.push(edge.weight);
        }
        return weights;
    }

    get inputOuputAs(): (number | null)[] {
        const inputAs = [];
        for (const edge of this.inputEdges) {
            inputAs.push(edge.fromNodeOutputA);
        }
        return inputAs;
    }


}
