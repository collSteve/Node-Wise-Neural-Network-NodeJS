import { ActivationFunctions } from "../../constants/activation-functions";
import { Queue } from "../../utils/queue";
import { uuid } from "../../utils/uuid";
import { NeuronLink, NeuronLinkArgs } from "../edge";
import { InputNode, InputNodeArgs } from "../input-node";
import { ActivationInfo, NeuronNode, NeuronNodeArgs } from "../node";
import { OutputNode, OutputNodeArgs } from "../out-put-node";

enum BasicEdgeType {
    FromInputNode,
    Standard,
    ToOutputNode
}

interface BasicNodeArgs extends NeuronNodeArgs {
    id: string
}

interface BasicEdgeArgs extends NeuronLinkArgs {
    id: string;
    edgeType?: BasicEdgeType;
}

interface BasicInputNodeArgs extends InputNodeArgs<BasicEdge> {
    id: string
}

interface BasicOutputNodeArgs extends OutputNodeArgs {
    id: string
}

interface BasicNetWorkArgs {
    inputNodes?: InputNode<BasicEdge>[];
    inputNodeNumbers?: number;
    outputNodeNumbers?: number;
    setupGraph?: boolean;
    defaultOutputNodeActivationInfo: ActivationInfo
}

export class BasicNode extends NeuronNode {
    forwardlyCalculated: boolean = false;
    backwardErrorCalculated: boolean = false;

    id: string;

    constructor(args: BasicNodeArgs) {
        super(args);
        this.id = args.id;
    }
}

export class BasicEdge extends NeuronLink {
    id: string;
    edgeType: BasicEdgeType;

    constructor(args: BasicEdgeArgs) {
        super(args);
        this.id = args.id;

        this.edgeType = args.edgeType ?? BasicEdgeType.Standard;
    }
}

export class BasicInputNode extends InputNode<BasicEdge> {
    id: string;

    constructor(args: BasicInputNodeArgs) {
        super(args);

        this.id = args.id;
    }

    static toBasicInputNode(inputNode: InputNode<BasicEdge>, id: string) {
        return new BasicInputNode({outputEdges: inputNode.outputEdges, id});
    }
}

export class BasicOutputNode extends OutputNode {
    id: string;

    constructor(args: BasicOutputNodeArgs) {
        super(args);
        this.id = args.id;
    }
}

export class BasicNetWork {
    inputNodesMap: Map<string, BasicInputNode>;
    nodesMap: Map<string, BasicNode>;
    edgesMap: Map<string, BasicEdge>;
    outputNodesMap: Map<string, BasicOutputNode>;

    constructor(args: BasicNetWorkArgs) {
        this.nodesMap = new Map();
        this.edgesMap = new Map();
        this.inputNodesMap = new Map();
        this.outputNodesMap = new Map();


        // Input Node configuration
        if (args.inputNodes) {
            for (const inputNode of args.inputNodes) {
                const id = uuid();
                this.inputNodesMap.set(id, BasicInputNode.toBasicInputNode(inputNode, id));
            }
        } else if (args.inputNodeNumbers) {
            for (let i=0; i< args.inputNodeNumbers; i++) {
                const id = uuid();
                this.inputNodesMap.set(id, new BasicInputNode({id: id}));
            }
        }

        // output node configuration
        if (args.outputNodeNumbers) {
            for (let i=0; i< args.outputNodeNumbers; i++) {
                const id = uuid();
                this.outputNodesMap.set(id, new BasicOutputNode({id: id, activationInfo: args.defaultOutputNodeActivationInfo}));
            }
        }

        // if empty graph (there is only input nodes and output nodes)
        if (args.setupGraph && this.edgesMap.size === 0 && this.nodesMap.size === 0) {
            const firstNodeId = uuid();
            const firstNode = new BasicNode({id: firstNodeId, activationInfo: {
                activationFunction: ActivationFunctions.sigmoid.function,
                activationFunctionDiff: ActivationFunctions.sigmoid.diffFunction
            }});

            this.nodesMap.set(firstNodeId, firstNode);

            // set up edges
            for (const [id, inputNode] of this.inputNodesMap.entries()) {
                const edgeId = uuid();

                const newEdge = new BasicEdge({id: edgeId, fromNeuron: inputNode, toNeuron: firstNode, weight: 0});

                this.edgesMap.set(edgeId, newEdge);
            }

            for (const [id, outputNode] of this.outputNodesMap.entries()) {
                const edgeId = uuid();

                const newEdge = new BasicEdge({id: edgeId, fromNeuron: firstNode, toNeuron: outputNode, weight: 0});

                this.edgesMap.set(edgeId, newEdge);
            }
        }
    }

    forwardPropergation() {
        const nodeQ = new Queue<BasicInputNode | BasicNode | BasicOutputNode>();

        // push in all input nodes
        for (const [id, inputNode] of this.inputNodesMap) {
            nodeQ.enqueue(inputNode);
        }

        while (!nodeQ.isEmpty) {
            const node = nodeQ.dequeue();
            if (!node) return; // not gonna happen but to convert type

            if (node.outputA != null) {
                if (!(node instanceof BasicOutputNode)) {
                    for (const outputEdge of node.outputEdges) {
                        nodeQ.enqueue(outputEdge.toNeuron as (BasicNode | BasicOutputNode));
                    }
                }
            } 
            else {
                // can't be input node cuz input node always have outputA
                if (node instanceof BasicInputNode) {
                    throw new Error("Cannot be inputNode");
                }

                // check if from nodes are calculated, if so calculate this node. else, enqueue back this node 
                let areFromNodesCalculated = this.#areFromNodesCalculated(node.inputEdges);
                
                if (areFromNodesCalculated) {
                    const outputAs: number[] = [];
                    const weights: number[] = [];
                    for (const edge of node.inputEdges) {
                        outputAs.push(edge.fromNeuron.outputA as number);
                        weights.push(edge.weight);
                    }
                    node.calculateOutputA(weights, outputAs);

                    for (const outputEdge of node.outputEdges) {
                        nodeQ.enqueue(outputEdge.toNeuron as (BasicNode | BasicOutputNode));
                    }
                }
                else {
                    nodeQ.enqueue(node);
                }
            }
            
        }
    }

    #areFromNodesCalculated(inputEdges: NeuronLink[]): boolean {
        for (const edge of inputEdges) {
            if (edge.fromNeuron.outputA == null) {
                return false;
            }
        }
        return true;
    }
}