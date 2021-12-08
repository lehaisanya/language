import fs from 'fs'
import { Logger } from './modules/logger'
import { Lexer } from "./modules/lexer"
import { Parser } from './modules/parser'

const DEBUG = true
const FILENAME = 'test/test1.lang'

try {
    const code = fs.readFileSync(FILENAME, 'utf-8')

    const logger = new Logger()
    logger.setSource(code, FILENAME)

    const lexer = new Lexer({ debug: DEBUG, logger })
    const tokens = lexer.scan(code)

    const parser = new Parser({ debug: DEBUG, logger })
    const ast = parser.parse(tokens)
} catch(err) {
    console.log(err)
}
