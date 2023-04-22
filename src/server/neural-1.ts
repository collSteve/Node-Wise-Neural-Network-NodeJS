import { ActivationFunctions } from "../constants/activation-functions";
import { BasicEdge, BasicNetWork, BasicNode, BasicOutputNode } from "../model/neural-net-work/basic-net-work";
import { ActivationInfo } from "../model/node";

export function startNeural1() {
    const defaultActivationInfo: ActivationInfo = {
        activationFunction: ActivationFunctions.sigmoid.function,
        activationFunctionDiff: ActivationFunctions.sigmoid.diffFunction
    }
    const network = new BasicNetWork({setupGraph: true, inputNodeNumbers: 3, outputNodeNumbers: 4, defaultOutputNodeActivationInfo: defaultActivationInfo});

    console.log('input:')
    for (const [id,inputNode] of network.inputNodesMap) {
        console.log(`${id}-->[${inputNode.outputEdges.map((edge)=>(edge.toNeuron as BasicNode | BasicOutputNode).id)}]`);
    }

    console.log('c nodes:');

    for (const [id,cNode] of network.nodesMap) {
        console.log(`${id}-->[${cNode.outputEdges.map((edge)=>(edge.toNeuron as BasicNode | BasicOutputNode).id)}]`);
    }

    console.log('output nodes:');
    for (const [id,outputNode] of network.outputNodesMap) {
        console.log(`${id}-->[${outputNode.outputEdges.map((edge)=>(edge.toNeuron as BasicNode | BasicOutputNode).id)}]`);
    }

    
}