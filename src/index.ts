import fs from 'fs'
import { Logger } from './modules/logger'
import { Lexer } from "./modules/lexer"
import { Parser } from './modules/parser'

const DEBUG = true
const FILENAME = 'test/test1.lang'
const LOGFILE = 'test/test1.log'

try {
    const code = fs.readFileSync(FILENAME, 'utf-8')
    const logfile = fs.createWriteStream(LOGFILE, 'utf-8')

    fs.rmSync(LOGFILE)

    const logger = new Logger({
        onLog: (message) => {
            logfile.write(message + '\n')
        },
        onError: (message) => {
            logfile.write(message + '\n')
        }
    })
    logger.setSource(code, FILENAME)

    const lexer = new Lexer({ debug: DEBUG, logger })
    const tokens = lexer.scan(code)

    const parser = new Parser({ debug: DEBUG, logger })
    const ast = parser.parse(tokens)
} catch(err) {
    console.log(err)
}
