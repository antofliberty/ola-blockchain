import {BlockConstructorArgs} from "./block"

export const INITIAL_DIFFICULTY: number = 10 // Must be >= 3
export const MINE_RATE: number = 3000
export const INITIAL_BALANCE = 1000

export const GENESIS_DATA: BlockConstructorArgs = {
    timestamp: 1712507070332,
    lastHash: 'lastHash',
    hash: 'hash',
    data: 'data',
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY
}
