const defaultConfig: LoggerConfig = {
    newlines: '\n',
    onLog: (message) => {
        console.log(message)
    },
    onError: (message) => {
        console.log(message)
    }
}

const defaultFilename = '<Anonymus chunk>'

export class Logger {
    private lines: string[] = []
    private filename: string = defaultFilename
    private config: LoggerConfig

    private get file(): FileData {
        return {
            filename: this.filename,
            lines: this.lines
        }
    }

    constructor(config: Partial<LoggerConfig> = {}) {
        this.config = {...defaultConfig, ...config}
    }

    public setSource(source: string, filename: string = defaultFilename) {
        this.lines = source.split(this.config.newlines)
        this.filename = filename
    }

    public log(message: string) {
        this.config.onLog(message)
    }

    public error(error: CompilerError) {
        const errorMessage = this.createErrorMessage(this.file, error)
        this.config.onError(errorMessage, this.file, error)
    }

    private createErrorMessage(
        { filename, lines }: FileData,
        { line, pos, length, type, message }: CompilerError
    ): string {
        const intro = `${filename} (${line}:${pos})\n`
        const codeLine = lines[line-1] + '\n'
        const pointer = ' '.repeat(pos-1) + '^'.repeat(length) + '\n'
        const errorMessage = `${type} Error: ${message}\n`
        const errorLog = intro + codeLine + pointer + '\n' + errorMessage
        return errorLog
    }
}
