import { Statement } from "."

export class VarDeclarationStatement extends Statement {
    variable: Token
    type: Token | null
    value: Token
    isConst: boolean

    constructor({ variable, type, value, isConst }: VarDeclarationConfig) {
        super("Variable declaration")
        this.variable = variable
        this.type = type
        this.value = value
        this.isConst = isConst
    }
}
