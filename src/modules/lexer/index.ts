import { Token, patterns } from "./tokens"

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
        this.log('====== Дебаг увімкнуто ======')
    }

    public scan(code: string): Token[] {
        this.source = code

        this.log(`===== Ісходні дані =====\n${JSON.stringify(code)}`)

        this.log('Сканування почалося...')

        while (this.isNoEnd) {
            this.log(`===== Скануємо новий токен ====`)
            const token = this.nextToken()
            this.log(`Знайдено токен ${token}`)
            this.tokens.push(token)
        }

        this.endOfFile()

        this.log('Сканування успішно завершилось')
        this.log(`Кількість відсканованих токенів ${this.tokens.length}`)

        return this.tokens.filter(
            token => !token.isInclude(TokenType.SPACE, TokenType.NEWLINE)
        )
    }

    private endOfFile() {
        const eof = new Token({
            type: TokenType.EOF,
            text: ' ',
            line: this.line,
            pos: this.pos,
            linePos: this.linePos,
        })
        this.tokens.push(eof)
        this.log(`Знайдено токен ${eof}`)
    }

    private nextToken(): Token {
        for (let pattern of patterns) {
            const token = this.checkPattern(pattern)

            if (token) {
                return token
            }
        }

        this.log(`Ні один паттерн не співпав`)

        const errorMessage = `Неочікуваний символ "${this.source[this.pos]}"`
        this.error(errorMessage)
    }

    private checkPattern(pattern: Pattern): Token | null {
        this.log(`Тестуємо паттерн ${pattern}`)
        const result = this.matchPattern(pattern)
        if (result) {
            this.log(`Паттерн співпав! ${JSON.stringify(result)}`)
        }

        return result ? this.createToken(pattern.tokenType, result) : null
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
        if (token.is(TokenType.NEWLINE)) {
            this.line++
            this.linePos = 0
        }
    }

    private matchPattern(pattern: Pattern): string | null {
        return pattern.match(this.source.substr(this.pos))
    }

    private log(message: string) {
        if (this.config.debug) {
            this.config.logger.log('[Лексер] ' + message)
        }
    }

    private error(message: string): never {
        const error: CompilerError = {
            type: "Синтаксична",
            length: 1,
            line: this.line,
            pos: this.linePos+1,
            message
        }
        this.log(message)
        this.config.logger.error(error)
        throw error
    }
}
