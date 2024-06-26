import * as crypto from "crypto"
import { ec as EC } from 'elliptic'

export const ec = new EC('secp256k1')


export function createHash(...inputs: any[]): string {
    const hash: crypto.Hash = crypto.createHash('sha256')
    hash.update(inputs.sort().map(input => typeof input === 'object' ? JSON.stringify(input) : input).join(''))

    return hash.digest('hex')
}
