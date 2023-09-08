const path = require('node:path')
const fs = require('node:fs')
const cv2 = require('@u4/opencv4nodejs')
const Audio = require('./audio')

module.exports = class Core {
  /** @readonly */
  static FRAME_SIZE = [71, 150] // [height, width]
  /** @readonly */
  static FPS = 24.2 // video fps
  /** @readonly */
  static ASCII_CHARS = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', ' ']

  /** @public @readonly @type {string[]} */
  asciiContent

  /** @public @readonly @type {import('node:readline').Interface} */
  rl
  /** @private @readonly @type {string} */
  framesPath
  /** @private @readonly @type {cv2.VideoCapture} */
  vc
  /** @private @readonly @type {import('./audio')} */
  audio

  constructor ({ videoPath, audioPath, framesPath, rl }) {
    this.videoPath = videoPath
    this.audioPath = audioPath
    this.framesPath = framesPath
    this.rl = rl

    this.asciiContent = []
    this.vc = new cv2.VideoCapture(videoPath)
    this.audio = new Audio(audioPath)

    this.totalFrames = this.vc.get(cv2.CAP_PROP_FRAME_COUNT)
  }

  /**
   * start play
   * @public
   * @returns {Promise<void>}
   */
  async play () {
    await this.prePlay()
    this.audio.play()
    for (let i = 0; i < this.asciiContent.length; i++) {
      this.rl.write('\n' + this.asciiContent[i]) // fix top line
      await this.sleep(Core.FPS)
    }
    this.audio.stop()
  }

  async close () {
    // this.audio.stop()
  }

  /**
   * checks for frames, if there are exists, reads their contents, and if not, creates them
   * @private
   * @returns {Promise<void>}
   */
  async prePlay () {
    if (this.totalFrames === this.asciiContent.length) {
      return
    }
    await fs.promises.mkdir(this.framesPath, { recursive: true })
    if (await this.checkFrames()) {
      await this.readFrames()
      return
    }
    await this.generate()
  }

  /**
   * generate frames files
   * @private
   * @returns {Promise<void>}
   */
  async generate () {
    this.rl.write('Please wait.\n')
    for (let currentFrame = 0; currentFrame < this.totalFrames; currentFrame++) {
      const frame = this.vc.read().resize(Core.FRAME_SIZE[0], Core.FRAME_SIZE[1])
      const asciiText = this.createAsciiText(frame.getDataAsArray())

      this.asciiContent.push(asciiText)
      fs.promises
        .writeFile(path.join(this.framesPath, this.getFrameFileName(currentFrame)), asciiText)
    }
  }

  /**
   * read frames from cache
   * @returns {Promise<void>}
   */
  async readFrames () {
    for (let i = 0; i < this.totalFrames; i++) {
      const file = await fs.promises.readFile(path.join(this.framesPath, this.getFrameFileName(i)))
      this.asciiContent.push(file.toString())
    }
  }

  /**
   * generate frame file name
   * @private
   * @param {number|string} index
   * @returns {string}
   */
  getFrameFileName (index) {
    return `frame-${index}.txt`
  }

  /**
   * create ascii text for row
   * @private
   * @param {(([number, number, number, number])[])[]} array pixels array
   * @returns {string}
   */
  createAsciiText (array) {
    return array.reduce((prev, row) => prev + this.createColAscii(row) + '\n', '')
  }

  /**
   * create ascii text for col
   * @param {([number, number, number, number])[]} col
   * @returns {string}
   */
  createColAscii (col) {
    return col.reduce((prev, pixel) => prev + this.getAsciiChar(...pixel), '')
  }

  /**
   * convert pixel to ascii char
   * @private
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @returns {string}
   */
  getAsciiChar (r, g, b) {
    return Core.ASCII_CHARS[Math.floor((r + g + b) / 3 / 25)]
  }

  /**
   * check cache
   * @private
   * @returns {Promise<boolean>}
   */
  async checkFrames () {
    const dirFiles = await fs.promises.readdir(this.framesPath)
    const frames = dirFiles.filter(fileName => fileName.match(/frame-(\d{1,}).txt/))
    return frames.length === this.totalFrames
  }

  /**
   * @private
   * @param {number} ms
   * @returns {Promise<void>}
   */
  async sleep (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
}
