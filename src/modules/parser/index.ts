import { LogStatement, SemiStatement } from "./statements"
import { VarDeclarationStatement } from "./statements/VarDeclarationStatement"

const defaultConfig: OptionalParserConfig = {
    debug: false
}

export class Parser {
    private tokens: Token[] = []
    private pos: number = 0
    private config: FullParserConfig
    private statements: Statement[] = []

    private get lastToken(): Token {
        return this.tokens[this.tokens.length-1]
    }

    private get current(): Token {
        return this.pos < this.tokens.length ? this.tokens[this.pos] : this.lastToken
    }

    private get isNoEnd(): boolean {
        return this.current.type !== TokenType.EOF
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
        let statement: Statement = null!
        switch (this.current.type) {
            case TokenType.LOG:
                statement = this.parseLog()
                break;
            case TokenType.LET:
            case TokenType.CONST:
            case TokenType.NAME:
                statement = this.parseVarDeclaration()
                break
            default:
                const message = `Unexpected token ${this.current}`
                this.error(message)
        }
        this.expectSemicolon()
        while (this.match(TokenType.SEMICOLON)) {
            this.expectSemicolon()
        }
        return statement
    }

    private parseLog(): LogStatement {
        this.expect(TokenType.LOG)
        const parameter = this.expect(TokenType.NUMBER)
        return new LogStatement(parameter)
    }

    private expectSemicolon() {
        this.expect(TokenType.SEMICOLON)
    }

    private parseVarDeclaration(): VarDeclarationStatement {
        const config = {} as VarDeclarationConfig
        config.isConst = this.match(TokenType.CONST)

        if (this.match(TokenType.CONST)) {
            this.expect(TokenType.CONST)
        } else  if (this.match(TokenType.LET)) {
            this.expect(TokenType.LET)
        }

        config.variable = this.expect(TokenType.NAME)

        if (this.match(TokenType.COLON)) {
            this.expect(TokenType.COLON)

            config.type = this.parseTypeExpressions()
        } else {
            config.type = null
        }

        this.expect(TokenType.ASSIGN)

        config.value = this.parseExpression()

        return new VarDeclarationStatement(config)
    }

    private parseTypeExpressions(): Token {
        switch (this.current.type) {
            case TokenType.NULL:
                return this.expect(TokenType.NULL)
            case TokenType.STRINGKEYWORD:
                return this.expect(TokenType.STRINGKEYWORD)
            case TokenType.NUMBERKEYWORD:
                return this.expect(TokenType.NUMBERKEYWORD)
            default:
                const errorMessage = `Expect type, but got ${this.current}`
                this.error(errorMessage)
        }
    }

    private parseExpression(): Token {
        switch (this.current.type) {
            case TokenType.NAME:
                return this.expect(TokenType.NAME)
            case TokenType.NUMBER:
                return this.expect(TokenType.NUMBER)
            case TokenType.STRING:
                return this.expect(TokenType.STRING)
            case TokenType.NULL:
                return this.expect(TokenType.NULL)
            default:
                const errorMessage = `Expected expression, but get ${this.current}`
                this.error(errorMessage)
        }
    }

    private match(tokenType: TokenType): boolean {
        return this.current.is(tokenType)
    }

    private expect(tokenType: TokenType): Token | never {
        if (!this.isNoEnd) {
            const errorMessage = `Expected token <${tokenType}>, but get end of file`
            this.error(errorMessage)
        }
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
        const token = this.current
        const error: CompilerError = {
            type: 'Syntax',
            length: token.text.length,
            line: token.line,
            pos: token.linePos+1,
            message,
        }
        this.log(message)
        this.config.logger.error(error)
        throw error
    }
}
