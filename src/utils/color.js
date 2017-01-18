let canvas  = document.createElement('canvas')
let context = canvas.getContext('2d')

export default { isHex, toHex, toRGB }

function isHex(value) {
  return value[0] === '#' && parseInt(value.slice(1), 16) < 16777215
}

function toHex(color) {
  if (Array.isArray(color))
    return '#' + color.map(channel => channel < 16 ? '0' + channel : channel.toString(16)).join('')
  context.fillStyle = color
  return context.fillStyle
}

function toRGB(hex) {
  if (!isHex(hex))
    hex = toHex(hex)
  let rgb = []
  for (let i = 3; i--;)
    rgb[i] = parseInt(hex.slice(i * 2 + 1, (i + 1) * 2 + 1), 16)
  return rgb
}
