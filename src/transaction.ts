import {randomUUID} from "crypto"
import {Wallet} from "./wallet"
import {verifySignature} from "./utils"
import {OlaError, TRANSACTION_UPDATE_AMOUNT_ERROR} from "./errors"
import {OutputMap, OutputMapArgs, TransactionConstructorArgs, TransactionInput} from "./types";

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

        this.input = this.createInput({ sender, outputMap: this.outputMap })
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

    update({ sender, recipient, amount }: OutputMapArgs): boolean {
        if (amount > this.outputMap[sender.publicKey]) {
            throw new OlaError(TRANSACTION_UPDATE_AMOUNT_ERROR)
        }

        if (!this.outputMap[recipient]) {
            this.outputMap[amount] = amount
        } else {
            this.outputMap[amount] = this.outputMap[recipient] + amount
        }

        this.outputMap[sender.publicKey] -= amount

        this.input = this.createInput({ sender, outputMap: this.outputMap })

        return true
    }
}
