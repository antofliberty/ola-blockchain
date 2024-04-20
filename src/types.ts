import {Wallet} from "./wallet";

// Numbers
export type Amount = number
export type Balance = number

// Address
export type Address = string

// Errors
type OlaBlockchainErrorName = 'WalletError' | 'TransactionError'

export type ErrorObject = {
    name: OlaBlockchainErrorName
    code: number,
    message : string
}

// Block
export type BlockConstructorArgs = {
    timestamp: number
    lastHash: string
    hash: string
    data: string
    nonce: number
    difficulty: number
}

// Transaction
export type OutputMapArgs = {
    sender: Wallet,
    recipient: string,
    amount: Amount
}

export type TransactionConstructorArgs = OutputMapArgs

export type TransactionInput =  {
    timestamp: number,
    amount: Amount,
    address: Address,
    signature: string
}

export type OutputMap = {
    [key: string]: number,
}

// Utils
export type VerifySignatureArgs = {
    publicKey: string,
    data: OutputMap | string,
    signature: string
}
