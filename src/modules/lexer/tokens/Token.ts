export class Token implements TokenData {
    public type!: TokenType
    public text!: string
    public line!: number
    public pos!: number
    public linePos!: number

    constructor (data: TokenData) {
        Object.assign(this, data)
    }

    public is(type: TokenType): boolean {
        return this.type.name === type.name
    }

    public isInclude(...types: TokenType[]) {
        return types.some(type => this.type.name === type.name)
    }

    public toString(): string {
        return `<${this.type} ${JSON.stringify(this.text)}>`
    }
}
