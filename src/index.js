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
  menu: { sprites: ['cell', 'edge'], sizes: 8 },
  text: {
    sprites: `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?-'"()<>`,
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

  let display = createContext(256, 224)

  let editor = createContext(display.canvas.width, display.canvas.height)
  editor.drawImage(sprites.select, 0, 0)

  display.drawImage(editor.canvas, 0, 0)

  let menu = createMenu(spritesheets.menu, 32, 8)
  let [spriteWidth, spriteHeight] = spritesheets.menu.sizes
  let menuWidth  = menu.cols * spriteWidth
  let menuHeight = menu.rows * spriteHeight
  window.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
      if (menu.visible || menu.drawing)
        return
      menu.visible = true
      menu.drawing = true
      let index = 0
      function step() {
        display.drawImage(drawMenu(menu, index++), 0, display.canvas.height - menuHeight)
        if (index < menu.cols * menu.rows / 16)
          window.requestAnimationFrame(step)
        else {
          menu.drawing = false
          let { context, spritesheet: { sizes: [spriteWidth, spriteHeight] }, cols, rows } = menu
          let { list: tiles, sizes: [tileWidth, tileHeight] } = spritesheets.tiles
          for (let i = 12, sprite; sprite = tiles[--i];)
            context.drawImage(sprite, i * tileWidth + 32, 24)
          context.drawImage(spritesheets.text.sprites['<'], 12, 28)
          context.drawImage(spritesheets.text.sprites['>'], spriteWidth * cols - 12 - 8, 28)
          display.drawImage(context.canvas, 0, display.canvas.height - spriteHeight * menu.rows)
        }
      }
      step()
    }
  })

  window.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
      if (!menu.visible || menu.drawing)
        return
      menu.visible = false
      menu.drawing = true
      display.drawImage(clearMenu(menu), 0, display.canvas.height - menuHeight)
      let index = 0
      function step() {
        display.drawImage(editor.canvas, 0, 0)
        display.drawImage(eraseMenu(menu, index++), 0, display.canvas.height - menuHeight)
        if (index < menu.cols * menu.rows / 16)
          window.requestAnimationFrame(step)
        else
          menu.drawing = false
      }
      step()
    }
  })

  document.querySelector('#app').appendChild(display.canvas)

}

function createContext(width, height) {
  let canvas  = document.createElement('canvas')
  let context = canvas.getContext('2d')
  canvas.width  = width
  canvas.height = height
  return context
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

function createMenu(spritesheet, cols, rows) {
  let [spriteWidth, spriteHeight] = spritesheet.sizes
  let context = createContext(cols * spriteWidth, rows * spriteHeight)
  return { context, spritesheet, cols, rows, drawing: false, visible: false }
}

function drawMenu(menu, index) {

  let { context, spritesheet, cols, rows } = menu
  let [spriteWidth, spriteHeight] = spritesheet.sizes

  const [CELL, EDGE] = spritesheet.list

  if (isNaN(index)) {
    for (let i = cols * rows; i--;) {
      let [x, y] = fromIndex(i, cols)
      let sprite = CELL
      if (!y || y === rows - 1)
        sprite = EDGE
      context.drawImage(sprite, x * spriteWidth, y * spriteHeight)
    }
  } else {
    let [curX, curY] = fromIndex(index, cols / 4).map(x => x * 4)
    for (let i = 0; i < 16; i++) {
      let [offX, offY] = fromIndex(i, 4)
      let x = curX + offX
      let y = curY + offY
      let sprite = CELL
      if (!y || y === rows - 1)
        sprite = EDGE
      context.drawImage(sprite, x * spriteWidth, y * spriteHeight)
    }
  }

  return context.canvas
}

function eraseMenu(menu, index) {
  let { context, spritesheet, cols, rows } = menu

  const SIZE = 8 * 4
  const [CELL, EDGE] = spritesheet.list

  if (isNaN(index))
    context.clearRect(0, 0, cols * SIZE, rows * SIZE)
  else {
    let [curX, curY] = fromIndex(index, cols / 4)
    context.clearRect(curX * SIZE, curY * SIZE, SIZE, SIZE)
  }

  return context.canvas
}

function clearMenu(menu) {
  let { context, spritesheet, cols, rows } = menu
  let [spriteWidth, spriteHeight] = spritesheet.sizes
  const [CELL] = spritesheet.list
  for (let i = cols * (rows - 2); i--;) {
    let [x, y] = fromIndex(i, cols)
    y++
    context.drawImage(CELL, x * spriteWidth, y * spriteHeight)
  }
  return context.canvas
}

function fromIndex(index, cols) {
  let x = index % cols
  let y = (index - x) / cols
  return [x, y]
}
