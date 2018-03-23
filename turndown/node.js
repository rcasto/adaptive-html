import {
    isBlock
} from './utilities';

export default function Node(node) {
    node.isBlock = isBlock(node)
    return node
}