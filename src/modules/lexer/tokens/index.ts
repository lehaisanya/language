import { patterns } from "./patterns"
import { TokenType } from './TokenType'
export { Token } from './Token'

type TokenName = keyof typeof patterns

const entries = Object.entries(patterns) as [TokenName, string][]

const tokenTypesEntries = entries
    .map(([name, pattern]) => [name, new TokenType(name, pattern)]) as [TokenName, TokenType][]

export const tokenTypes = Object.fromEntries(tokenTypesEntries) as Record<TokenName, TokenType>

export const tokenTypeList: TokenType[] = tokenTypesEntries.map(([_, tokenType]) => tokenType)

export {
    TokenType
}
