import { INITIAL_BALANCE } from "./config"
import {ec} from "./crypto"
import {createHash} from "./crypto";
import {OutputMap, Transaction} from "./transaction";


export class Wallet {
    publicKey: string
    balance: number
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
            throw new WalletError(INSUFFICIENT_FUNDS_ERROR)
        }

        return new Transaction({ sender: this, amount, recipient })
    }
}

type OlaBlockchainError = {
    code: number,
    message : string
}

const INSUFFICIENT_FUNDS_ERROR: OlaBlockchainError = { code: 101, message: '' }

export class WalletError extends Error {
    errorCode: number;

    constructor(error: OlaBlockchainError) {
        super(error.message);
        this.name = "WalletError";
        this.errorCode = error.code;
        Object.setPrototypeOf(this, WalletError.prototype);
    }
}
