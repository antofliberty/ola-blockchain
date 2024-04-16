import {Transaction} from "../src/transaction";
import {describe, expect} from "@jest/globals";
import {Wallet} from "../src/wallet";


describe('Transaction', () => {

    let transaction: Transaction
    let sender: Wallet
    let recipient: string
    let amount: number

    beforeEach(() => {
        sender = new Wallet()
        recipient = 'recipient'
        amount = 100

        transaction = new Transaction({ sender, recipient, amount })
    })

    it('Has an id', () => {
        expect(transaction).toHaveProperty('id')
    });

    describe('outputMap', () => {
        it('Has an output map', () => {
            expect(transaction).toHaveProperty('outputMap')
        });

        it('Outputs the amount to the recipient', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount)
        });

        it('Outputs the remaining balance for the sender wallet', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount)
        });
    })

    describe('input', () => {
        it('Has an input', () => {
            expect(transaction).toHaveProperty('input')
        });
        it('Has an input', () => {
            expect(transaction.input).toHaveProperty('timestamp')
        });
    })

    describe('valid()', () => {

        sender = new Wallet()
        recipient = 'recipient'
        amount = 100

        transaction = new Transaction({ sender, recipient, amount })

        describe('When TX is valid', () => {

            expect(transaction.validate(transaction)).toBe(true)
        })

        describe('When TX is not valid', () => {
            describe('OutputMap is invalid', () => {
                it('Returns false', () => {
                    transaction.outputMap[sender.publicKey] = 999

                    expect(transaction.validate(transaction)).toBe(false)
                });

            })
            describe('Signature is invalid', () => {
                it('Returns false', () => {
                    transaction.input.signature = new Wallet().sign('badData')

                    expect(transaction.validate(transaction)).toBe(false)
                })
            })
        })
    })
})
