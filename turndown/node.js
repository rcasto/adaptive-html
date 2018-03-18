import {
    isBlock,
    isVoid,
    hasVoid
} from './utilities'

export default function Node(node) {
    node.isBlock = isBlock(node)
    node.isBlank = isBlank(node)
    return node
}

function isBlank(node) {
    return (
        ['A', 'TH', 'TD'].indexOf(node.nodeName) === -1 &&
        /^\s*$/i.test(node.textContent) &&
        !isVoid(node) &&
        !hasVoid(node)
    )
}