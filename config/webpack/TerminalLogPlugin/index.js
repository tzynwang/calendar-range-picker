/*
Inspired by Clean Terminal Webpack Plugin
https://www.npmjs.com/package/clean-terminal-webpack-plugin
*/

const getLogger = require('webpack-log');

class TerminalLogPlugin {
  constructor({ message, name }) {
    this.message = message
    this.name = name
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tap('TerminalLogPlugin', () => {
      this.clearLog()
    })

    compiler.hooks.afterCompile.tap('TerminalLogPlugin', () => {
      this.clearLog()
    })

    compiler.hooks.done.tap('TerminalLogPlugin', () => {
      const output = this.message.length ? `${this.message}\n` : null
      if (output) {
        const log = getLogger({ name: this.name.length ? this.name : 'cra template choffee' });
        log.info(output)
      }
    })
  }

  clearLog() {
    const clear = '\x1B[2J\x1B[3J\x1B[H'
    process.stdout.write(clear)
  }
}

module.exports = TerminalLogPlugin
