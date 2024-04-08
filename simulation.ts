import {Blockchain} from "./blockchain";
import Block from "./block";

const SIMULATION_ITERATIONS: number = 7

const blockchain: Blockchain = new Blockchain()

blockchain.pushBlock({
    data: 'exampleData'
})

console.log(blockchain.chain[blockchain.chain.length-1])

const timeSpentList: number[] = []

for (let i = 0; i < SIMULATION_ITERATIONS; i++) {
    const prevTimestamp: number = blockchain.chain[blockchain.chain.length - 1].timestamp

    blockchain.pushBlock({ data: `Block #${i + 1}` })
    const newBlock: Block = blockchain.chain[blockchain.chain.length - 1]

    const timeSpent: number = newBlock.timestamp - prevTimestamp
    timeSpentList.push(timeSpent)

    const averageMiningTime: number = timeSpentList.reduce((total, num) => total + num)/timeSpentList.length

    console.log(`Time spent at block #${i + 1} ${(timeSpent / 1000).toFixed(2)}s`)
    console.log(`Difficulty = ${newBlock.difficulty}`)
    console.log(`Average time ${(averageMiningTime / 1000).toFixed(2)}s\n`)

}
