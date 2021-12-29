import fs from 'fs'
import { Logger } from './modules/logger'
import { Lexer } from "./modules/lexer"
import { Parser } from './modules/parser'

const DEBUG = true
const FILENAME = 'test/test1.lang'
const LOGFILE = 'test/test1'
const TOKENSFILE = 'test/test1.tokens.json'

const lexerLog = fs.createWriteStream(LOGFILE + '.lexer.log', 'utf-8')
const parserLog = fs.createWriteStream(LOGFILE + '.parser.log', 'utf-8')

const lexerLogger = new Logger({
    onLog: (message) => {
        lexerLog.write(message + '\n')
    },
    onError: (message) => {
        lexerLog.write(message + '\n')
    }
})

try {
    const code = fs.readFileSync(FILENAME, 'utf-8')
    fs.rmSync(LOGFILE + '.lexer.log')
    fs.rmSync(LOGFILE + '.parser.log')

    const parserLogger = new Logger({
        onLog: (message) => {
            parserLog.write(message + '\n')
        },
        onError: (message) => {
            parserLog.write(message + '\n')
        }
    })
    lexerLogger.setSource(code, FILENAME)
    parserLogger.setSource(code, FILENAME)

    const lexer = new Lexer({ debug: DEBUG, logger: lexerLogger })
    const tokens = lexer.scan(code)

    fs.writeFileSync(TOKENSFILE, JSON.stringify(tokens, null, 4), 'utf-8')

    const parser = new Parser({ debug: DEBUG, logger: parserLogger })
    const ast = parser.parse(tokens)
} catch(err) {
    const message = lexerLogger.createErrorMessage(err as CompilerError)
    lexerLogger.error(err as CompilerError)
    console.log(message)
}
