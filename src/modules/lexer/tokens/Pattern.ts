export class Pattern {
    tokenType: TokenType
    regexp: RegExp

    constructor(tokenType: TokenType, pattern: string) {
        this.tokenType = tokenType
        this.regexp = new RegExp('^' + pattern)
    }

    public match(source: string): string | null {
        const matches = source.match(this.regexp)
        return matches && matches[0] ? matches[0] : null
    }

    public toString(): string {
        return `<${this.tokenType} ${this.regexp}>`
    }
}
