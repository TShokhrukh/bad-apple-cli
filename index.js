const path = require('node:path')
const readline = require('node:readline')
const Controls = require('./src/controls')
const Core = require('./src/core')

const VIDEO_PATH = path.join(__dirname, 'static', 'video.mp4')
const AUDIO_PATH = path.join(__dirname, 'static', 'audio.wav')
const FRAMES_PATH = path.join(__dirname, 'frames')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const core = new Core({
  audioPath: AUDIO_PATH,
  videoPath: VIDEO_PATH,
  framesPath: FRAMES_PATH,
  rl
})

const controls = new Controls(rl, core, { Start: '1', Exit: '2' })

controls.main()
