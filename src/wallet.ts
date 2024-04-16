import { INITIAL_BALANCE } from "./config"
import {ec} from "./crypto"
import {createHash} from "./crypto";


export class Wallet {
    publicKey: string
    balance: number
    private keyPair

    constructor() {
        this.balance = INITIAL_BALANCE
        this.keyPair = ec.genKeyPair()
        this.publicKey = this.keyPair.getPublic().encode('hex', false)
    }

    sign(data: string): string {
        const hash = createHash(data);
        const signature = this.keyPair.sign(hash);
        return signature.toDER('hex');
    }
}
