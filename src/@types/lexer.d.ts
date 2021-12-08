declare interface RequiredLexerConfig {
    logger: Logger
}

declare interface OptionalLexerConfig {
    debug: boolean
}

declare type LexerConfig = RequiredLexerConfig & Partial<OptionalLexerConfig>

declare type FullLexerConfig = RequiredLexerConfig & OptionalLexerConfig

declare const enum TokenType {
    LOG = 'LOG',
    NUMBER = 'NUMBER',
    VARIABLE = 'VARIABLE',
    SEMICOLON = 'SEMICOLON',
    SPACE = 'SPACE',
    NEWLINE = 'NEWLINE',
    ASSIGN = 'ASSIGN',
    PLUS = 'PLUS',
    MINUS = 'MINUS',
    LPAREN = 'LPARENT',
    RPAREN = 'RPARENT',
    EOF = 'EOF'
}

declare class Pattern {
    tokenType: TokenType
    regexp: RegExp
    constructor(tokenType: TokenType, pattern: string)
    match(source: string): string | null
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
