import {GENESIS_DATA, MINE_RATE} from "./config";
import {createHash} from "./crypto";
import {hexToBinary} from "./utils";

export interface BlockConstructorArgs {
    timestamp: number
    lastHash: string
    hash: string
    data: string
    nonce: number
    difficulty: number
}

class Block {
    timestamp: number
    private data: string
    lastHash: string
    hash: string
    nonce: number
    difficulty: number

    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }: BlockConstructorArgs) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty
    }

    static genesis(): Block {
        return new this(GENESIS_DATA)
    }

    static mineBlock({ lastBlock, data }: { lastBlock: Block, data: string }): Block {
        let hash: string
        let timestamp: number = Date.now()
        let nonce: number = 0

        const lastHash: string = lastBlock.hash
        let { difficulty }: { difficulty: number } = lastBlock

        do {
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty({
                originalBlock: lastBlock,
                timestamp
            })
            hash = createHash(timestamp, lastHash, nonce, difficulty)
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty))

        return new this({
            timestamp,
            lastHash,
            hash,
            data,
            nonce,
            difficulty
        })
    }

    static adjustDifficulty({ originalBlock, timestamp }: { originalBlock: Block, timestamp: number}): number {
        const { difficulty } = originalBlock
        const difference: number = timestamp - originalBlock.timestamp

        if (difficulty < 1) {
            return 1
        }

        return difference > MINE_RATE ? difficulty - 1 : difficulty + 1
    }
}

export default Block
