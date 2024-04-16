import {createHash, ec} from "./crypto";
import {OutputMap} from "./transaction";

export function hexToBinary(hexString: string): string {
    // A map of hex digit to binary string
    const hexToBinMap: { [key: string]: string } = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011',
        '4': '0100', '5': '0101', '6': '0110', '7': '0111',
        '8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
        'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'
    };

    // Convert the hex string to uppercase to simplify matching
    hexString = hexString.toUpperCase();

    // Convert each hex digit to its binary representation and concatenate
    let binaryString = '';
    for (const hexDigit of hexString) {
        const binaryDigits = hexToBinMap[hexDigit];
        if (binaryDigits === undefined) {
            throw new Error(`Invalid hexadecimal character: ${hexDigit}`);
        }
        binaryString += binaryDigits;
    }

    return binaryString;
}

type VerifySignatureArgs = {
    publicKey: string,
    data: OutputMap | string,
    signature: string
}

export function verifySignature({ publicKey, data, signature }: VerifySignatureArgs) {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')

    return keyFromPublic.verify(createHash(data), signature)
}
