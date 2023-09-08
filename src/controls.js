/**
 * @typedef {{
 *  Start: string,
 *  Exit: string,
 * }} TAnswers
 */

module.exports = class Controls {
  /** @public @readonly @type {import('node:readline').Interface} */
  rl
  /** @public @readonly @type {null} */
  core
  /** @public @readonly @type {TAnswers} */
  answers

  /**
   * @constructor
   * @param {import('node:readline').Interface} rl
   * @param {import('./core')} core
   * @param {TAnswers} answers
   */
  constructor (rl, core, answers) {
    this.rl = rl
    this.core = core
    this.answers = answers
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async main () {
    console.clear()
    this.rl.write('Select option?\n')
    this.rl.write(`${this.answers.Start}) Play\n`)
    this.rl.write(`${this.answers.Exit}) Exit\n`)

    switch (await this.question('Your option: ')) {
      case this.answers.Start:
        await this.play()
        this.main()
        return
      case this.answers.Exit:
        this.exit()
        return
      default:
        this.rl.write('Unknown input!\n')
        this.main()
    }
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async play () {
    await this.core.play()
    return null
  }

  /**
   * @public
   * @returns {Promise<void>}
   */
  async exit () {
    this.rl.close()
    this.core.close()
  }

  /**
   * @private
   * @param {string} query
   * @returns {Promise<string>}
   */
  question (query) {
    return new Promise((resolve) => {
      this.rl.question(query, resolve)
    })
  }
}
