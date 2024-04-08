import {BlockConstructorArgs} from "./block"

export const INITIAL_DIFFICULTY: number = 18
export const MINE_RATE: number = 3000

export const GENESIS_DATA: BlockConstructorArgs = {
    timestamp: 1712507070332,
    lastHash: 'lastHash',
    hash: 'hash',
    data: 'data',
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY
}
