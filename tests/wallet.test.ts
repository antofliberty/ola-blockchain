import {Wallet, WalletError} from "../src/wallet";
import {describe, expect} from "@jest/globals";
import {verifySignature} from "../src/utils";
import {Transaction} from "../src/transaction";

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
            })).toBe(false)
        });
    })


    describe('Creating transaction', () => {
        describe('Amount', () => {

            let transaction: Transaction
            let amount: number
            let recipient: string

            beforeEach(() => {
                amount = 50
                recipient = 'testRecipient'
                transaction = wallet.createTransaction({ amount, recipient })
            })

            it('Throws WalletError when amount is higher than wallet balance', () => {
                expect(() => {
                    wallet.createTransaction({ amount: 9999, recipient: 'testRecipient' });
                }).toThrow(WalletError)
            });

            it('Input address equals to wallet pubKey', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey)
            });

            it('Amount of outputMap equals to amount', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount)
            });

        })

        describe('Amount is ok', () => {

        })
    })

})


