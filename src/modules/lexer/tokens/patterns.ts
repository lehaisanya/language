import { Pattern } from "./Pattern"

export const patterns = [
    new Pattern(TokenType.LOG, 'log'),
    new Pattern(TokenType.LET, 'let'),
    new Pattern(TokenType.CONST, 'const'),
    new Pattern(TokenType.TYPE, 'type'),
    new Pattern(TokenType.IMPORT, 'import'),
    new Pattern(TokenType.EXPORT, 'export'),
    new Pattern(TokenType.FROM, 'from'),

    new Pattern(TokenType.NUMBER, '[0-9]+'),
    new Pattern(TokenType.NAME, '[a-zA-Z_][a-zA-Z0-9_]*'),
    new Pattern(TokenType.STRING, '".*"'),
    new Pattern(TokenType.NULL, 'null'),

    new Pattern(TokenType.COMMA, ','),
    new Pattern(TokenType.SEMICOLON, ';'),
    new Pattern(TokenType.SPACE, '[ \\t]+'),
    new Pattern(TokenType.NEWLINE, '((\\r\\n)|(\\n\\r?))'),

    new Pattern(TokenType.ASSIGN, '='),
    new Pattern(TokenType.PLUS, '\\+'),
    new Pattern(TokenType.MINUS, '\\-'),
    new Pattern(TokenType.STAR, '\\*'),
    new Pattern(TokenType.SLASH, '\\/'),
    new Pattern(TokenType.COLON, ':'),

    new Pattern(TokenType.LPAREN, '\\('),
    new Pattern(TokenType.RPAREN, '\\)'),
]
