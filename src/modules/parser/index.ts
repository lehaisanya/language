import { tokenTypes } from "../lexer/tokens"
import { LogStatement, SemiStatement } from "./statements"

const defaultConfig: OptionalParserConfig = {
    debug: false
}

export class Parser {
    private tokens: Token[] = []
    private pos: number = 0
    private config: FullParserConfig
    private statements: Statement[] = []

    private get current(): Token {
        return this.tokens[this.pos]
    }

    private get isNoEnd(): boolean {
        return this.pos < this.tokens.length
    }

    constructor(config: ParserConfig) {
        this.config = { ...defaultConfig, ...config }
        this.log('Debug is enabling')
    }

    public parse(tokens: Token[]): Statement[] {
        this.tokens = tokens

        this.log('Parsing...')

        while (this.isNoEnd) {
            const statement = this.parseStatement()
            this.statements.push(statement)
            this.log(`Parse new statement\n${statement}`)
        }

        this.log('Parsing successfuly ended')

        return this.statements
    }

    private parseStatement(): Statement {
        switch (this.current.type.name) {
            case "LOG":
                return this.parseLog()
            case "SEMICOLON":
                return this.parseSemicolon()
            default:
                const message = `Unexpected token ${this.current}`
                this.error(message)
        }
    }

    private parseLog(): LogStatement {
        this.expect(tokenTypes.LOG)
        const parameter = this.expect(tokenTypes.NUMBER)
        return new LogStatement(parameter)
    }

    private parseSemicolon(): SemiStatement {
        this.expect(tokenTypes.SEMICOLON)
        return new SemiStatement()
    }

    private match(tokenType: TokenType): boolean {
        return this.current.is(tokenType)
    }

    private expect(tokenType: TokenType): Token | never {
        if (this.current.is(tokenType)) {
            return this.next()
        } else {
            const errorMessage = `Expected token <${tokenType}>, but get ${this.current}`
            this.error(errorMessage)
        }
    }

    private next(): Token {
        const current = this.current
        this.pos++
        return current
    }

    private log(message: string) {
        if (this.config.debug) {
            this.config.logger.log('[Parser] ' + message)
        }
    }

    private error(message: string): never {
        this.log(message)
        const token = this.current
        this.config.logger.error({
            type: 'Syntax',
            length: token.text.length,
            line: token.line,
            pos: token.linePos+1,
            message,
        });
    }
}
