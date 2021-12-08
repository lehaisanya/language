declare interface RequiredParserConfig {
    logger: Logger
}

declare interface OptionalParserConfig {
    debug: boolean
}

declare type ParserConfig = RequiredParserConfig & Partial<OptionalParserConfig>

declare type FullParserConfig = RequiredParserConfig & OptionalParserConfig

declare abstract class Statement {
    name: string
    constructor(name: string)
    toString(): string
}
