import {randomUUID} from "crypto";
import {Wallet} from "./wallet";
import {verifySignature} from "./utils";

type OutputMapArgs = {
    sender: Wallet,
    recipient: string,
    amount: number
}

type TransactionConstructorArgs = OutputMapArgs

type TransactionInput =  {
    timestamp: number,
    amount: number,
    address: string,
    signature: string
}

export type OutputMap = {
    [key: string]: number,
}

export class Transaction {
    public id: string
    public outputMap: OutputMap
    public input: TransactionInput

    constructor({ sender, recipient, amount }: TransactionConstructorArgs) {
        this.id = randomUUID()
        this.outputMap = this.createOutputMap({
            sender,
            recipient,
            amount
        })

        this.input = this.createInput({ sender, outputMap: this.outputMap });
    }

    createOutputMap({ sender, recipient, amount }: OutputMapArgs): OutputMap {
        const outputMap: OutputMap = {}
        outputMap[recipient] = amount
        outputMap[sender.publicKey] = sender.balance - amount

        return outputMap
    }

    createInput({ sender, outputMap }: { sender: Wallet, outputMap: OutputMap }): TransactionInput {
        return {
            timestamp: Date.now(),
            amount: sender.balance,
            address: sender.publicKey,
            signature: sender.sign(outputMap)
        }
    }

    validate(transaction: Transaction): boolean {
        const { input: { address, amount, signature }, outputMap, id } = transaction

        const outputTotal: number = Object.values(outputMap)
            .reduce((total, outputAmount) => total + outputAmount)


        if (amount !== outputTotal) {
            console.log(`Transaction with ID ${id} has different input and output amount`)
            return false
        }

        if (!verifySignature({
            publicKey: address,
            data: outputMap,
            signature
        })) {
            console.log(`Transaction with ID ${id} has an invalid signature`)
            return false
        }

        return true
    }
}
