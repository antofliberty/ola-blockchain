import {Transaction} from "../src/transaction"
import {describe, expect} from "@jest/globals"
import {Wallet} from "../src/wallet"
import {OlaError} from "../src/errors"
import {Amount, Address} from "../src/types";


describe('Transaction', () => {

    let transaction: Transaction
    let sender: Wallet
    let recipient: Address
    let amount: Amount

    beforeEach(() => {
        sender = new Wallet()
        recipient = 'recipient'
        amount = 100

        transaction = new Transaction({ sender, recipient, amount })
    })

    it('Has an id', () => {
        expect(transaction).toHaveProperty('id')
    })

    describe('outputMap', () => {
        it('Has an output map', () => {
            expect(transaction).toHaveProperty('outputMap')
        })

        it('Outputs the amount to the recipient', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount)
        })

        it('Outputs the remaining balance for the sender wallet', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount)
        })
    })

    describe('input', () => {
        it('Has an input', () => {
            expect(transaction).toHaveProperty('input')
        })
        it('Has an input', () => {
            expect(transaction.input).toHaveProperty('timestamp')
        })
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
                })

            })
            describe('Signature is invalid', () => {
                it('Returns false', () => {
                    transaction.input.signature = new Wallet().sign('badData')

                    expect(transaction.validate(transaction)).toBe(false)
                })
            })
        })
    })

    describe('update()', () => {

        let originalSignature: string
        let originalSenderOutput: number
        let nextRecipient: Address
        let nextAmount: Amount

        describe('Amount is valid', () => {
            it('Throws TransactionError', () => {
                expect(() => {
                    transaction.update({ sender, recipient: '228', amount: 99999 })
                }).toThrow(OlaError)
            })
        })

        beforeEach(() => {
            originalSignature = transaction.input.signature
            originalSenderOutput = transaction.outputMap[sender.publicKey]
            nextRecipient = 'nextRecipient'
            nextAmount = 50

            transaction.update({ sender, recipient: nextRecipient, amount: nextAmount })
        })

        it('Outputs the amount to the next recipient', () => {
            expect(transaction.outputMap[nextRecipient])
        })

        it('Subtract the amount from the original sender output amount', () => {
            expect(transaction.outputMap[sender.publicKey]).toEqual(originalSenderOutput - nextAmount)
        })

        it('Maintains a total output that matches the input amount', () => {
            expect(
                Object.values(transaction.outputMap)
                    .reduce(
                        (total, outputAmount) => total + outputAmount)
            ).toEqual(transaction.input.amount)

        })

        it('Resigns the transaction', () => {
            expect(transaction.input.signature).not.toEqual(originalSignature)
        })


    })
})
