import {describe, expect} from "@jest/globals";
import {Blockchain} from "../blockchain";
import Block from "../block";


describe('isValidChain()', (): void => {

    const blockchain: Blockchain = new Blockchain();

    it('Chain does not starts with genesis block', (): void => {
        blockchain.chain[0].hash = 'incorrect_hash'

        expect(blockchain.isValidChain(blockchain.chain)).toBe(false)
    })

    it('Chain is valid', (): void => {
        blockchain.chain[0] = Block.genesis()
        blockchain.chain[1] = Block.mineBlock({
            lastBlock: blockchain.chain[0],
            data: 'data'
        })

        expect(blockchain.isValidChain(blockchain.chain)).toEqual(true)
    })

})

describe('blockchainManipulation', (): void => {
    it('Pushes the block correctly', (): void => {
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

    it('Does not replace the chain', (): void => {
        const blockchain: Blockchain = new Blockchain();
        blockchain.pushBlock({
            data: 'newCorrectBlock'
        })
        const newCorrectChain: Block[] = blockchain.chain

        expect(blockchain.replaceChain(newCorrectChain)).toEqual(true)

    })
})

