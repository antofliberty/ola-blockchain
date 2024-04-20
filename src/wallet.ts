import { INITIAL_BALANCE } from "./config"
import {ec} from "./crypto"
import {createHash} from "./crypto";
import {Transaction} from "./transaction";
import {INSUFFICIENT_FUNDS_ERROR, OlaError} from "./errors";
import {Balance, OutputMap} from "./types";

export class Wallet {
    publicKey: string
    balance: Balance
    private keyPair

    constructor() {
        this.balance = INITIAL_BALANCE
        this.keyPair = ec.genKeyPair()
        this.publicKey = this.keyPair.getPublic().encode('hex', false)
    }

    sign(data: OutputMap | string): string {
        const hash = createHash(data);
        const signature = this.keyPair.sign(hash);
        return signature.toDER('hex');
    }

    createTransaction({ amount, recipient }: { amount: number, recipient: string }): Transaction {
        if (amount > this.balance) {
            throw new OlaError(INSUFFICIENT_FUNDS_ERROR)
        }

        return new Transaction({ sender: this, amount, recipient })
    }
}


