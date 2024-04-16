import {Wallet} from "../src/wallet";
import {describe, expect} from "@jest/globals";
import {verifySignature} from "../src/utils";

describe('Wallet', (): void => {
    let wallet: Wallet

    beforeEach(() => {
        wallet = new Wallet()
    })


    it('Has balance', () => {
        expect(wallet).toHaveProperty('balance')
    });

    it('Has public key', () => {
        expect(wallet).toHaveProperty('publicKey')
    });

    describe('Signing data', (): void => {
        it('Signs data', () => {
            const data = 'testData'

            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })).toBe(true)
        });
        it('Does not sign data', () => {
            const data = 'testData'

            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: new Wallet().sign(data)
            })).toBe(true)
        });
    })

})


