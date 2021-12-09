declare interface RequiredLexerConfig {
    logger: Logger
}

declare interface OptionalLexerConfig {
    debug: boolean
}

declare type LexerConfig = RequiredLexerConfig & Partial<OptionalLexerConfig>

declare type FullLexerConfig = RequiredLexerConfig & OptionalLexerConfig

declare const enum TokenType {
    // KEYWORDS
    LET = "LET",
    CONST = 'CONST',
    TYPE = "TYPE",
    LOG = 'LOG',
    IMPORT = "IMPORT",
    EXPORT = "EXPORT",
    FROM = "FROM",

    // LITERALS
    NUMBER = 'NUMBER',
    NAME = 'NAME',
    STRING = 'STRING',
    NULL = "NULL",

    // SYSTEM
    COMMA = "KOMMA",
    SEMICOLON = 'SEMICOLON',
    INLINECOMMENT = "INLINECOMMENT",
    MULTILINECOMMENT = "MULTILINECOMMENT",
    SPACE = 'SPACE',
    NEWLINE = 'NEWLINE',
    EOF = 'EOF',

    // OPERATORS
    ASSIGN = 'ASSIGN',
    PLUS = 'PLUS',
    MINUS = 'MINUS',
    STAR = "STAR",
    SLASH = "SLASH",
    COLON = "COLON",

    // PARENCES
    LPAREN = 'LPARENT',
    RPAREN = 'RPARENT',
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
