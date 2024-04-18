// Numbers
type Amount = number
type Balance = number

// Address
type Address = string

// Errors
type OlaBlockchainErrorName = 'WalletError' | 'TransactionError'

type ErrorObject = {
    name: OlaBlockchainErrorName
    code: number,
    message : string
}
