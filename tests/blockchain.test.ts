import {describe, expect} from "@jest/globals";
import {Blockchain} from "../src/blockchain";
import {Block} from "../src/block";
import {createHash} from "../src/crypto";
import {INITIAL_DIFFICULTY} from "../src/config";


describe('isValidChain()', () => {

    const blockchain: Blockchain = new Blockchain();

    it('Chain does not starts with genesis block', () => {
        blockchain.chain[0].hash = 'incorrect_hash'

        expect(blockchain.isValidChain(blockchain.chain)).toBe(false)
    })

    it('Chain is valid', () => {
        blockchain.chain[0] = Block.genesis()
        blockchain.chain[1] = Block.mineBlock({
            lastBlock: blockchain.chain[0],
            data: 'data'
        })

        expect(blockchain.isValidChain(blockchain.chain)).toEqual(true)
    })

    it('Prevents difficulty jump', () => {

        const timestamp: number = Date.now()
        const data: string = 'newData'
        const lastHash: string = blockchain.chain[0].hash
        const nonce: number = 0
        const difficulty: number = INITIAL_DIFFICULTY - 2

        blockchain.chain[1] = new Block({
            timestamp,
            data,
            nonce,
            lastHash,
            hash: createHash(timestamp, data, nonce, lastHash, difficulty),
            difficulty
        })

        expect(blockchain.isValidChain(blockchain.chain)).toEqual(false)
    })

})

describe('blockchainManipulation', () => {
    it('Pushes the block correctly', () => {
        const blockchain: Blockchain = new Blockchain();
        blockchain.pushBlock({ data: 'newBlock' })

        expect(blockchain.chain[blockchain.chain.length - 1].lastHash
            === blockchain.chain[blockchain.chain.length - 2].hash).toEqual(true)
    })

    it('Replaces the chain', () => {
        const blockchain: Blockchain = new Blockchain();

        const newWrongChain: Block[] = [
            Block.genesis(),
            new Block({
                timestamp: Date.now(),
                data: 'newData',
                nonce: 0,
                lastHash: 'wrongLastHash',
                hash: 'newHash',
                difficulty: 3
            })
        ]
        expect(blockchain.replaceChain(newWrongChain)).toEqual(false)
    });

    it('Does not replace the chain', () => {
        const blockchain: Blockchain = new Blockchain();
        blockchain.pushBlock({
            data: 'newCorrectBlock'
        })
        const newCorrectChain: Block[] = blockchain.chain

        expect(blockchain.replaceChain(newCorrectChain)).toEqual(true)

    })
})

