import { tokenTypeList, tokenTypes, Token } from "./tokens"

const defaultConfig: OptionalLexerConfig = {
    debug: false
}

export class Lexer {
    private source: string = ''
    private config: FullLexerConfig
    private pos: number = 0
    private line: number = 1
    private linePos: number = 0
    private tokens: Token[] = []

    private get isNoEnd(): boolean {
        return this.pos < this.source.length
    }

    constructor(config: LexerConfig) {
        this.config = { ...defaultConfig, ...config }
        this.log('Debugging is enabled')
    }

    public scan(code: string): Token[] {
        this.source = code

        this.log('Scaning...')

        while (this.isNoEnd) {
            this.nextToken()
        }

        this.log('Scanning successfuly ended')
        this.log(`Scanned tokens count is ${this.tokens.length}`)

        return this.tokens.filter(
            token => !token.isInclude(tokenTypes.SPACE, tokenTypes.NEWLINE)
        )
    }

    private nextToken() {
        for (let tokenType of tokenTypeList) {
            const token = this.checkTokenType(tokenType)

            if (token) {
                this.tokens.push(token)
                this.log(`Find token ${token.toString()}`)
                return
            }
        }

        const errorMessage = `Unexpected character "${this.source[this.pos]}"`
        this.error(errorMessage)
    }

    private checkTokenType(tokenType: TokenType): Token | null {
        const result = this.matchPattern(tokenType.pattern)

        return result ? this.createToken(tokenType, result) : null
    }

    private createToken(type: TokenType, text: string): Token {
        const token = new Token({
            type,
            text,
            line: this.line,
            pos: this.pos,
            linePos: this.linePos
        })
        this.moveToken(token)
        return token
    }

    private moveToken(token: Token) {
        this.pos += token.text.length
        this.linePos += token.text.length
        if (token.is(tokenTypes.NEWLINE)) {
            this.line++
            this.linePos = 0
        }
    }

    private matchPattern(pattern: RegExp): string | null {
        const matches = this.source.substr(this.pos).match(pattern)
        return matches && matches[0] ? matches[0] : null
    }

    private log(message: string) {
        if (this.config.debug) {
            this.config.logger.log('[Lexer] ' + message)
        }
    }

    private error(message: string): never {
        this.log(message)
        this.config.logger.error({
            type: "Syntaxs",
            length: 1,
            line: this.line,
            pos: this.linePos+1,
            message
        })
    }
}
