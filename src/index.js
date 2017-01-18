import Color from './utils/color'
import Alpha from './utils/alpha'
import Image from './utils/image'

import Spritesheet from './utils/spritesheet'

let spritesheets = {}
let sprites = {
  mario: {
    sprites: {
      idle: 0,
      run0: 1,
      run1: 2,
      run2: 3,
      skid: 4,
      jump: 5,
      ouch: 6,
        idle_big: [ 0, 16, 16, 32],
        run0_big: [16, 16, 16, 32],
        run1_big: [32, 16, 16, 32],
        run2_big: [48, 16, 16, 32],
        skid_big: [64, 16, 16, 32],
        jump_big: [80, 16, 16, 32],
      crouch_big: [96, 16, 16, 32]
    }
  },
  tiles: {
    sprites: [
      'bush_l', 'bush_m', 'bush_r', 'hill_slope_l', 'hill_slope_r', 'hill_top', 'pipe_top_l', 'pipe_top_r', 'stone',
      'cloud_ul', 'cloud_u', 'cloud_ur', 'hill_spots_a', 'hill_spots_b', 'hill', 'pipe_l', 'pipe_r', 'block',
      'cloud_dl', 'cloud_d', 'cloud_dr', 'sky', 'question0', 'question1', 'question2', 'questionX', 'brick'
    ]
  },
  text: {
    sprites: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!-<>',
    sizes: 8
  }
}

let names = [...Object.keys(sprites), 'select']
let files = names.map(name => `images/${name}.png`)

Image.load(files, setup)

function setup(images) {

  images.forEach(function (image, index) {
    image = Alpha.process(image, 'magenta')
    let name = names[index]
    let options = sprites[name]
    if (options)
      spritesheets[name] = Spritesheet.make(image, options)
    else
      sprites[name] = image
  })

  let canvas = document.createElement('canvas')
  canvas.width  = 256
  canvas.height = 224

  let context = canvas.getContext('2d')
  context.drawImage(sprites.select, 0, 0)

  let greeting = renderText(spritesheets.text, 'Hello world!')
  context.drawImage(greeting, canvas.width / 2 - greeting.width / 2, canvas.height / 2 - greeting.height / 2)

  document.querySelector('#app').appendChild(canvas)

}

function renderText(spritesheet, text) {

  let sprites = spritesheet.sprites

  let [spriteWidth, spriteHeight] = spritesheet.sizes

  let width  = spriteWidth * text.length
  let height = spriteHeight

  let canvas = document.createElement('canvas')
  canvas.width  = width
  canvas.height = height

  let context = canvas.getContext('2d')

  let i = text.length
  while (i--) {
    let char = text[i]
    let sprite = sprites[char] || sprites[char.toUpperCase()] || sprites[char.toLowerCase()]
    if (!sprite)
      continue
    context.drawImage(sprite, i * spriteWidth, 0, spriteWidth, spriteHeight)
  }

  return canvas

}
