export default { make }

function make(image, options) {

  let spritesheet = { at: {}, list: [] }

  let sizes = [16, 16]
  let sprites = []
  if (!isNaN(options)) {
    sizes = [options, options]
    options = null
  } else if (Array.isArray(options)) {
    sizes = options
    options = null
  } else if (typeof options === 'object') {
      sizes = options.sizes   || sizes
    sprites = options.sprites || sprites
  }

  if (!isNaN(sizes))
    sizes = [sizes, sizes]

  spritesheet.sizes = sizes
  if (sprites.length || typeof sprites === 'object' && Object.keys(sprites).length)
    spritesheet.sprites = {}

  let [spriteWidth, spriteHeight]  = sizes

  let cols = image.width  / spriteWidth
  let rows = image.height / spriteHeight

  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      let sprite = makeSprite(image, [x * spriteWidth, y * spriteHeight, spriteWidth, spriteHeight])
      spritesheet.at[x + ',' + y] = sprite
      spritesheet.list.push(sprite)
    }

  if (typeof sprites === 'string')
    sprites = sprites.split('')

  if (Array.isArray(sprites)) {
    sprites.forEach(function (name, index) {
      let x = index % cols
      let y = (index - x) / cols
      spritesheet.sprites[name] = makeSprite(image, [x * spriteWidth, y * spriteHeight, spriteWidth, spriteHeight])
    })
  } else if (typeof sprites === 'object') {
    Object.keys(sprites).forEach(function (name, index) {
      let value = sprites[name]
      let x, y, width, height
      if (!isNaN(value)) {
        width  = spriteWidth
        height = spriteHeight
        x = index * width
        y = 0
      } else if (Array.isArray(value)) {
        x = value[0]
        y = value[1]
        width  = spriteWidth
        height = spriteHeight
        if (value.length === 4) {
          width  = value[2]
          height = value[3]
        }
      }
      spritesheet.sprites[name] = makeSprite(image, [x, y, width, height])
    })
  }

  return spritesheet

}

function makeSprite(image, rect) {

  let [x, y, width, height] = rect

  let canvas = document.createElement('canvas')
  canvas.width  = width
  canvas.height = height

  let context = canvas.getContext('2d')
  context.drawImage(image, x, y, image.width, image.height, 0, 0, image.width, image.height)

  return canvas

}
