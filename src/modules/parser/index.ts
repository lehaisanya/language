import { LogStatement, SemiStatement } from "./statements"
import { VarDeclarationStatement } from "./statements/VarDeclarationStatement"

const CUSTOM_ERROR_FOR_EOF = true
const NEED_SEMICOLON = true

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

    private get isEnd(): boolean {
        return this.current.type === TokenType.EOF
    }

    constructor(config: ParserConfig) {
        this.config = { ...defaultConfig, ...config }
        this.log(`============================================================`)
        this.log('====== Дебаг увімкнуто ======')
    }

    public parse(tokens: Token[]): Statement[] {
        this.tokens = tokens

        this.log('Парсинг почався...')

        while (!this.isEnd) {
            this.statements.push(this.parseStatement())
        }

        this.log('Парсинг успішно завершився')
        this.log(`Кількість розпаршених висказуваннь ${this.statements.length}`)

        return this.statements
    }

    private parseStatement(): Statement {
        this.log('====== Парсимо нове висказування ======')
        this.log(`Дивимося на наступний токен ${this.current}`)
        let statement: Statement = null!

        switch (this.current.type) {
            case TokenType.LOG:
                statement = this.parseLog()
                break;
            case TokenType.LET:
            case TokenType.CONST:
                statement = this.parseVarDeclaration()
                break
            default:
                const message = `Неочікуваний токен ${this.current}`
                this.error(message)
        }

        this.expectSemicolon()

        this.log(`Розпарсили нове висказування\n${statement}`)

        return statement
    }

    private parseLog(): LogStatement {
        this.log(`Зрозуміло, що перед нами визказування виводу на екран`)
        this.skip()

        this.log(`Далі повинен слідувати вираз`)
        const parameter = this.parseExpression()

        return new LogStatement(parameter)
    }

    private parseVarDeclaration(): VarDeclarationStatement {
        this.log(`Зрозуміло, що перед нами висказування опису змінної`)
        const config = {} as VarDeclarationConfig

        if (this.match(TokenType.CONST)) {
            this.log(`Тепер зрозуміло що описується константа`)
            config.isConst = true
        } else {
            this.expect(TokenType.LET)
            config.isConst = false
        }

        config.variable = this.expect(TokenType.NAME)

        if (this.match(TokenType.COLON)) {
            this.log(`Значить далі визначення типу`)
            config.type = this.parseTypeExpression()
        } else {
            this.log(`Значить висказування без визначення типу`)
            config.type = null
        }

        if (this.match(TokenType.ASSIGN)) {
            this.log(`Значить далі вираз`)
            config.value = this.parseExpression()
        } else {
            this.log(`Значить висказування без визначення значеня`)
            config.value = null
        }

        return new VarDeclarationStatement(config)
    }

    private parseTypeExpression(): Token {
        this.log(`Починаємо парсити вираз типу`)
        let expression: Token = null!

        switch (this.current.type) {
            case TokenType.NULL:
            case TokenType.STRINGKEYWORD:
            case TokenType.NUMBERKEYWORD:
                this.log(`Ми знайшли токен типу ${this.current}`)
                expression = this.skip()
                break
            default:
                const errorMessage = `Очікувати тип, але отримали ${this.current}`
                this.error(errorMessage)
        }

        this.log(`Ми успішно розпарсили вираз типу ${expression}`)
        return expression
    }

    private parseExpression(): Token {
        this.log(`Починаємо парсити вираз`)
        let expression: Token = null!

        switch (this.current.type) {
            case TokenType.NAME:
            case TokenType.NUMBER:
            case TokenType.STRING:
            case TokenType.NULL:
                this.log(`Ми знайшли токен виразу ${this.current}`)
                expression = this.skip()
                break
            default:
                const errorMessage = `Очікували вираз, але отримали ${this.current}`
                this.error(errorMessage)
        }

        this.log(`Ми успішно розпарсили вираз ${expression}`)
        return expression
    }

    private expectSemicolon() {
        if (NEED_SEMICOLON) {
            this.expect(TokenType.SEMICOLON)
        }
        while (this.match(TokenType.SEMICOLON)) {}
    }

    private expect(tokenType: TokenType): Token | never {
        this.log(`Очікуємо токен <${tokenType}>`)
        if (CUSTOM_ERROR_FOR_EOF && this.isEnd) {
            const errorMessage = `Очікували токен <${tokenType}>, але отримали кінець файлу`
            this.error(errorMessage)
        } else if (!this.check(tokenType)) {
            const errorMessage = `Очікували токен <${tokenType}>, але отримали ${this.current}`
            this.error(errorMessage)
        } else {
            return this.skip()
        }
    }

    private match(tokenType: TokenType): Token | null {
        return this.check(tokenType) ? this.skip() : null
    }

    private check(tokenType: TokenType): boolean {
        this.log(`Перевіряємо чи наступний токен <${tokenType}>`)
        if (this.current.is(tokenType)) {
            this.log(`Так, він наступний`)
        } else {
            this.log(`Ні`)
        }
        return this.current.is(tokenType)
    }

    private skip(): Token {
        const current = this.current
        this.log(`Пропускаєм ${current} і переходим до наступного токену`)
        this.pos++
        return current
    }

    private log(message: string) {
        if (this.config.debug) {
            this.config.logger.log('[Парсер] ' + message)
        }
    }

    private error(message: string): never {
        const token = this.current
        const error: CompilerError = {
            type: 'Синтаксична',
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
