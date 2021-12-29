import { Statement } from "./Statement"

export class LogStatement extends Statement {
    public value: Token

    constructor(value: Token) {
        super('Log')
        this.value = value
    }
}
