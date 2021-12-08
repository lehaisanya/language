export class TokenType {
    public name: string
    public pattern: RegExp

    constructor (name: string, pattern: string) {
        this.name = name
        this.pattern = new RegExp('^' + pattern)
    }

    public toString(): string {
        return this.name
    }
}
