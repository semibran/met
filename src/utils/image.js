let regex = /^\/?(?:.+\/)*(.+)\./

export default { load }

function load(paths, callback) {
  if (!callback)
    return
  if (!Array.isArray(paths))
    return loadOne(paths, callback)
  let images = []
  let index  = 0
  let max    = paths.length
  let path   = paths[index]
  let loaded = [path]
  function next(image) {
    let id = regex.exec(path)[1]
    if (!images[id])
      images[id] = image
    else
      images[id] = [images[id], image]
    images[index++] = image
    if (index >= max)
      return callback(images)
    path = paths[index]
    loadOne(path, next)
  }
  loadOne(path, next)
}

function loadOne(path, callback) {
  if (!callback)
    return
  let image = new window.Image
  image.src = path
  image.onload = function () {
    callback(image)
  }
}
