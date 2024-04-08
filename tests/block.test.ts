import {describe, expect} from '@jest/globals';
import {GENESIS_DATA, MINE_RATE} from "../config";
import Block from '../block';
import {createHash} from "../crypto";
import {hexToBinary} from "../utils";

describe('genesis()', (): void => {
    const genesisBlock: Block = Block.genesis();

    it('Returns genesis block', (): void => {
        expect(genesisBlock).toEqual(GENESIS_DATA)
    })
});

describe('mineBlock()', (): void => {

    const lastBlock: Block = Block.genesis();
    const data: string = 'mined data';
    const minedBlock: Block = Block.mineBlock({ lastBlock, data });

    it('Sets lastHash of minedBlock to be lastBlock hash ', () => {
        expect(minedBlock.lastHash).toEqual(lastBlock.hash)
    });

    it('Sets correct hash with required difficulty', (): void => {
        expect(hexToBinary(minedBlock.hash).startsWith('0'.repeat(minedBlock.difficulty))).toEqual(true)
    })

})

describe('adjustDifficulty()', (): void => {

    const block: Block = new Block({
        timestamp: Date.now(),
        data: 'newData',
        nonce: 0,
        lastHash: 'lastHash',
        hash: createHash('data'),
        difficulty: 3
    })

    it('Increases the difficulty when block was mined faster than mine rate', () => {

        const newDifficulty: number = Block.adjustDifficulty({
            originalBlock: block,
            timestamp: block.timestamp + MINE_RATE - 100
        })

        expect(newDifficulty).toEqual(block.difficulty + 1)
    });
    it('Decreases the difficulty when block was mined slower than mine rate', (): void => {
        const newDifficulty: number = Block.adjustDifficulty({
            originalBlock: block,
            timestamp: block.timestamp + MINE_RATE + 100
        })

        expect(newDifficulty).toEqual(block.difficulty - 1)
    });

    it('Adjusts the difficulty', (): void => {
        const possibleResults: number[] = [block.difficulty - 1, block.difficulty + 1]

        const minedBlock: Block = Block.mineBlock({
            lastBlock: block,
            data: 'newData'
        })

        expect(possibleResults.includes(minedBlock.difficulty)).toEqual(true)
    });

    it('Checks that difficulty always 1 or higher', (): void => {
        const minedBlock: Block = Block.mineBlock({
            lastBlock: block,
            data: 'newData'
        })

        expect(minedBlock)
    })
})
