export class OlaError extends Error {
    errorCode: number;

    constructor(error: ErrorObject) {
        super(error.message)
        this.name = error.name
        this.errorCode = error.code
        Object.setPrototypeOf(this, OlaError.prototype)
    }
}

export const INSUFFICIENT_FUNDS_ERROR: ErrorObject = {
    name: 'WalletError',
    code: 101,
    message: 'The requested amount is higher than the current balance'
}
