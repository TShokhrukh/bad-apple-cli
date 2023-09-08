const fs = require('node:fs')
const Speaker = require('speaker')

module.exports = class Audio {
  /**
   * @private
   * @type {boolean}
   */
  _isPlay

  /**
   * @private
   * @type {string}
   */
  _path

  /**
   * @private
   * @type {Speaker}
   */
  _speaker

  /**
   * @private
   * @type {fs.ReadStream}
   */
  _stream

  constructor (path) {
    this._path = path
    this._isPlay = false
  }

  /**
   * @public
   * @returns {boolean}
   */
  get isPlay () {
    return this._isPlay
  }

  /**
   * play audio
   * @public
   * @returns {void}
   */
  async play () {
    if (this._isPlay) {
      throw new Error(`The audio ${this.path} is already played`)
    }
    this._isPlay = true
    this._stream = fs.createReadStream(this._path)
    this._speaker = new Speaker()
    this._stream.pipe(this._speaker)
  }

  /**
   * stop audio
   * @public
   * @returns {void}
   */
  async stop () {
    if (!this._isPlay) {
      throw new Error(`The audio ${this.path} is already stopped`)
    }
    this._isPlay = false
    this._stream.unpipe(this._speaker)
    this._speaker.end()
  }
}
