import Color from './color'

export default { process }

function process(images, ...colors) {
  if (!Array.isArray(images))
    images = [images]
  let processed = []
  for (let image of images) {
    for (let color of colors)
      image = processOne(Color.toRGB(color), image)
    processed.push(image)
  }
  if (processed.length === 1)
    return processed[0]
  return processed
}

function processOne(key, image) {

  let [red, green, blue] = key
  let { width, height }  = image

  let canvas = document.createElement('canvas')
  canvas.width  = width
  canvas.height = height

  let context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)

  let imageData = context.getImageData(0, 0, width, height)
  let data = imageData.data

  let area = width * height
  for (let i = area; i--;) {
    let index = i * 4
    let [r, g, b, a] = data.slice(index, index + 4)
    if (a && r === red && g === green && b === blue) {
      data[index]     = 0
      data[index + 1] = 0
      data[index + 2] = 0
      data[index + 3] = 0
    }
  }

  context.putImageData(imageData, 0, 0)

  return canvas

}
