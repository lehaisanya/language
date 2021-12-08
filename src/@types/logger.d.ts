declare interface CompilerError {
    line: number
    pos: number
    length: number
    message: string
    type: string
}

declare interface FileData {
    filename: string
    lines: string[]
}

declare interface LoggerConfig {
    newlines: string
    onLog(message: string)
    onError(file: FileData, error: CompilerError): never
}

declare class Logger {
    constructor(config: Partial<LoggerConfig>)
    setSource(source: string, filename?: string)
    log(message: string)
    error(error: CompilerError): never
}
