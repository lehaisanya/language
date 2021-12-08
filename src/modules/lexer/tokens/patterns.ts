import { Pattern } from "./Pattern"

// const patterns_old = {
//     LOG: 'log',
//     NUMBER: '[0-9]*',
//
//     SEMICOLON: ';',
//     SPACE: '[ \\t]+',
//     NEWLINE: '\\r?\\n',
//     ASSIGN: '=',
//     PLUS: '\\+',
//     MINUS: '-',
//     LPARENT: '\\(',
//     RPARENT: '\\)',
// }

export const patterns = [
    new Pattern(TokenType.LOG, 'log'),
    new Pattern(TokenType.NUMBER, '[0-9]+'),
    new Pattern(TokenType.SEMICOLON, ';'),
    new Pattern(TokenType.NEWLINE, '((\\r\\n)|(\\n\\r?))'),
    new Pattern(TokenType.SPACE, '[ \\t]+'),
    new Pattern(TokenType.VARIABLE, '[a-zA-Z_][a-zA-Z0-9_]*'),
]
