import * as crypto from "crypto";

export function createHash(...inputs: any[]): string {
    const hash: crypto.Hash = crypto.createHash('sha256')
    hash.update(inputs.sort().join(''))

    return hash.digest('hex')
}
