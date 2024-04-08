import Block from "./block";

export class Blockchain {
    public chain: Block[]

    constructor() {
        this.chain = [Block.genesis()]
    }

    replaceChain(newChain: Block[]): boolean {
        if (!this.isValidChain(newChain)) {
            return false
        }

        this.chain = newChain

        return true
    }

    pushBlock({ data }: { data: string }) {
        const newBlock: Block = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })

        this.chain.push(newBlock)
    }

    isValidChain(chain: Block[]): boolean {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false
        }

        for (let i = 1; i < chain.length; i++) {
            const lastHashAndHashEqual: boolean = chain[i].lastHash === chain[i - 1].hash
            if (!lastHashAndHashEqual) {
                return false
            }
        }

        return true
    }
}
