declare interface RequiredLexerConfig {
    logger: Logger
}

declare interface OptionalLexerConfig {
    debug: boolean
}

declare type LexerConfig = RequiredLexerConfig & Partial<OptionalLexerConfig>

declare type FullLexerConfig = RequiredLexerConfig & OptionalLexerConfig

declare class TokenType {
    name: string
    pattern: RegExp
    constructor(name: string, pattern: string)
    toString(): string
}

declare interface TokenData {
    type: TokenType
    text: string
    line: number
    pos: number
    linePos: number
}

declare class Token extends TokenData {
    type: TokenType
    text: string
    line: number
    pos: number
    linePos: number
    constructor(data: TokenData)
    is(type: TokenType): boolean
    isInclude(...type: TokenType[]): boolean
    toString(): string
}
