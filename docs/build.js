(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var Color = { isHex: isHex, toHex: toHex, toRGB: toRGB };

function isHex(value) {
  return value[0] === '#' && parseInt(value.slice(1), 16) < 16777215;
}

function toHex(color) {
  if (Array.isArray(color)) return '#' + color.map(function (channel) {
    return channel < 16 ? '0' + channel : channel.toString(16);
  }).join('');
  context.fillStyle = color;
  return context.fillStyle;
}

function toRGB(hex) {
  if (!isHex(hex)) hex = toHex(hex);
  var rgb = [];
  for (var i = 3; i--;) {
    rgb[i] = parseInt(hex.slice(i * 2 + 1, (i + 1) * 2 + 1), 16);
  }return rgb;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Alpha = { process: process };

function process(images) {
  if (!Array.isArray(images)) images = [images];
  var processed = [];

  for (var _len = arguments.length, colors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    colors[_key - 1] = arguments[_key];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var image = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = colors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var color = _step2.value;

          image = processOne(Color.toRGB(color), image);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      processed.push(image);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (processed.length === 1) return processed[0];
  return processed;
}

function processOne(key, image) {
  var _key2 = slicedToArray(key, 3),
      red = _key2[0],
      green = _key2[1],
      blue = _key2[2];

  var width = image.width,
      height = image.height;


  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  var context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  var imageData = context.getImageData(0, 0, width, height);
  var data = imageData.data;

  var area = width * height;
  for (var i = area; i--;) {
    var index = i * 4;

    var _data$slice = data.slice(index, index + 4),
        _data$slice2 = slicedToArray(_data$slice, 4),
        r = _data$slice2[0],
        g = _data$slice2[1],
        b = _data$slice2[2],
        a = _data$slice2[3];

    if (a && r === red && g === green && b === blue) {
      data[index] = 0;
      data[index + 1] = 0;
      data[index + 2] = 0;
      data[index + 3] = 0;
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
}

var regex = /^\/?(?:.+\/)*(.+)\./;

var Image = { load: load };

function load(paths, callback) {
  if (!callback) return;
  if (!Array.isArray(paths)) return loadOne(paths, callback);
  var images = [];
  var index = 0;
  var max = paths.length;
  var path = paths[index];
  var loaded = [path];
  function next(image) {
    var id = regex.exec(path)[1];
    if (!images[id]) images[id] = image;else images[id] = [images[id], image];
    images[index++] = image;
    if (index >= max) return callback(images);
    path = paths[index];
    loadOne(path, next);
  }
  loadOne(path, next);
}

function loadOne(path, callback) {
  if (!callback) return;
  var image = new window.Image();
  image.src = path;
  image.onload = function () {
    callback(image);
  };
}

var Spritesheet = { make: make };

function make(image, options) {

  var spritesheet = { at: {}, list: [] };

  var sizes = [16, 16];
  var sprites = [];
  if (!isNaN(options)) {
    sizes = [options, options];
    options = null;
  } else if (Array.isArray(options)) {
    sizes = options;
    options = null;
  } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    sizes = options.sizes || sizes;
    sprites = options.sprites || sprites;
  }

  if (!isNaN(sizes)) sizes = [sizes, sizes];

  spritesheet.sizes = sizes;
  if (sprites.length || (typeof sprites === 'undefined' ? 'undefined' : _typeof(sprites)) === 'object' && Object.keys(sprites).length) spritesheet.sprites = {};

  var _sizes = sizes,
      _sizes2 = slicedToArray(_sizes, 2),
      spriteWidth = _sizes2[0],
      spriteHeight = _sizes2[1];

  var cols = image.width / spriteWidth;
  var rows = image.height / spriteHeight;

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var sprite = makeSprite(image, [x * spriteWidth, y * spriteHeight, spriteWidth, spriteHeight]);
      spritesheet.at[x + ',' + y] = sprite;
      spritesheet.list.push(sprite);
    }
  }if (typeof sprites === 'string') sprites = sprites.split('');

  if (Array.isArray(sprites)) {
    sprites.forEach(function (name, index) {
      var x = index % cols;
      var y = (index - x) / cols;
      spritesheet.sprites[name] = makeSprite(image, [x * spriteWidth, y * spriteHeight, spriteWidth, spriteHeight]);
    });
  } else if ((typeof sprites === 'undefined' ? 'undefined' : _typeof(sprites)) === 'object') {
    Object.keys(sprites).forEach(function (name, index) {
      var value = sprites[name];
      var x = void 0,
          y = void 0,
          width = void 0,
          height = void 0;
      if (!isNaN(value)) {
        width = spriteWidth;
        height = spriteHeight;
        x = index * width;
        y = 0;
      } else if (Array.isArray(value)) {
        x = value[0];
        y = value[1];
        width = spriteWidth;
        height = spriteHeight;
        if (value.length === 4) {
          width = value[2];
          height = value[3];
        }
      }
      spritesheet.sprites[name] = makeSprite(image, [x, y, width, height]);
    });
  }

  return spritesheet;
}

function makeSprite(image, rect) {
  var _rect = slicedToArray(rect, 4),
      x = _rect[0],
      y = _rect[1],
      width = _rect[2],
      height = _rect[3];

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  var context = canvas.getContext('2d');
  context.drawImage(image, x, y, image.width, image.height, 0, 0, image.width, image.height);

  return canvas;
}

var spritesheets = {};
var sprites = {
  mario: {
    sprites: {
      idle: 0,
      run0: 1,
      run1: 2,
      run2: 3,
      skid: 4,
      jump: 5,
      ouch: 6,
      idle_big: [0, 16, 16, 32],
      run0_big: [16, 16, 16, 32],
      run1_big: [32, 16, 16, 32],
      run2_big: [48, 16, 16, 32],
      skid_big: [64, 16, 16, 32],
      jump_big: [80, 16, 16, 32],
      crouch_big: [96, 16, 16, 32]
    }
  },
  tiles: {
    sprites: ['bush_l', 'bush_m', 'bush_r', 'hill_slope_l', 'hill_slope_r', 'hill_top', 'pipe_top_l', 'pipe_top_r', 'stone', 'cloud_ul', 'cloud_u', 'cloud_ur', 'hill_spots_a', 'hill_spots_b', 'hill', 'pipe_l', 'pipe_r', 'block', 'cloud_dl', 'cloud_d', 'cloud_dr', 'sky', 'question0', 'question1', 'question2', 'questionX', 'brick']
  },
  menu: { sprites: ['cell', 'edge'], sizes: 8 },
  text: {
    sprites: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?-\'"()<>',
    sizes: 8
  }
};

var names = [].concat(toConsumableArray(Object.keys(sprites)), ['select']);
var files = names.map(function (name) {
  return 'images/' + name + '.png';
});

Image.load(files, setup);

function setup(images) {

  images.forEach(function (image, index) {
    image = Alpha.process(image, 'magenta');
    var name = names[index];
    var options = sprites[name];
    if (options) spritesheets[name] = Spritesheet.make(image, options);else sprites[name] = image;
  });

  var display = createContext(256, 224);

  var editor = createContext(display.canvas.width, display.canvas.height);
  editor.drawImage(sprites.select, 0, 0);

  display.drawImage(editor.canvas, 0, 0);

  var menu = createMenu(spritesheets.menu, 32, 8);

  var _spritesheets$menu$si = slicedToArray(spritesheets.menu.sizes, 2),
      spriteWidth = _spritesheets$menu$si[0],
      spriteHeight = _spritesheets$menu$si[1];

  var menuWidth = menu.cols * spriteWidth;
  var menuHeight = menu.rows * spriteHeight;
  window.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
      var _ret = function () {
        var step = function step() {
          display.drawImage(drawMenu(menu, index++), 0, display.canvas.height - menuHeight);
          if (index < menu.cols * menu.rows / 16) window.requestAnimationFrame(step);else {
            menu.drawing = false;

            var context = menu.context,
                _menu$spritesheet$siz = slicedToArray(menu.spritesheet.sizes, 2),
                _spriteWidth = _menu$spritesheet$siz[0],
                _spriteHeight = _menu$spritesheet$siz[1],
                cols = menu.cols,
                rows = menu.rows;

            var _spritesheets$tiles = spritesheets.tiles,
                tiles = _spritesheets$tiles.list,
                _spritesheets$tiles$s = slicedToArray(_spritesheets$tiles.sizes, 2),
                tileWidth = _spritesheets$tiles$s[0],
                tileHeight = _spritesheets$tiles$s[1];

            for (var i = 12, sprite; sprite = tiles[--i];) {
              context.drawImage(sprite, i * tileWidth + 32, 24);
            }context.drawImage(spritesheets.text.sprites['<'], 12, 28);
            context.drawImage(spritesheets.text.sprites['>'], _spriteWidth * cols - 12 - 8, 28);
            display.drawImage(context.canvas, 0, display.canvas.height - _spriteHeight * menu.rows);
          }
        };

        if (menu.visible || menu.drawing) return {
            v: void 0
          };
        menu.visible = true;
        menu.drawing = true;
        var index = 0;

        step();
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  });

  window.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
      var _ret2 = function () {
        var step = function step() {
          display.drawImage(editor.canvas, 0, 0);
          display.drawImage(eraseMenu(menu, index++), 0, display.canvas.height - menuHeight);
          if (index < menu.cols * menu.rows / 16) window.requestAnimationFrame(step);else menu.drawing = false;
        };

        if (!menu.visible || menu.drawing) return {
            v: void 0
          };
        menu.visible = false;
        menu.drawing = true;
        display.drawImage(clearMenu(menu), 0, display.canvas.height - menuHeight);
        var index = 0;

        step();
      }();

      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
    }
  });

  document.querySelector('#app').appendChild(display.canvas);
}

function createContext(width, height) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  return context;
}

function createMenu(spritesheet, cols, rows) {
  var _spritesheet$sizes2 = slicedToArray(spritesheet.sizes, 2),
      spriteWidth = _spritesheet$sizes2[0],
      spriteHeight = _spritesheet$sizes2[1];

  var context = createContext(cols * spriteWidth, rows * spriteHeight);
  return { context: context, spritesheet: spritesheet, cols: cols, rows: rows, drawing: false, visible: false };
}

function drawMenu(menu, index) {
  var context = menu.context,
      spritesheet = menu.spritesheet,
      cols = menu.cols,
      rows = menu.rows;

  var _spritesheet$sizes3 = slicedToArray(spritesheet.sizes, 2),
      spriteWidth = _spritesheet$sizes3[0],
      spriteHeight = _spritesheet$sizes3[1];

  var _spritesheet$list = slicedToArray(spritesheet.list, 2),
      CELL = _spritesheet$list[0],
      EDGE = _spritesheet$list[1];

  if (isNaN(index)) {
    for (var i = cols * rows; i--;) {
      var _fromIndex = fromIndex(i, cols),
          _fromIndex2 = slicedToArray(_fromIndex, 2),
          x = _fromIndex2[0],
          y = _fromIndex2[1];

      var sprite = CELL;
      if (!y || y === rows - 1) sprite = EDGE;
      context.drawImage(sprite, x * spriteWidth, y * spriteHeight);
    }
  } else {
    var _fromIndex$map = fromIndex(index, cols / 4).map(function (x) {
      return x * 4;
    }),
        _fromIndex$map2 = slicedToArray(_fromIndex$map, 2),
        curX = _fromIndex$map2[0],
        curY = _fromIndex$map2[1];

    for (var _i = 0; _i < 16; _i++) {
      var _fromIndex3 = fromIndex(_i, 4),
          _fromIndex4 = slicedToArray(_fromIndex3, 2),
          offX = _fromIndex4[0],
          offY = _fromIndex4[1];

      var x = curX + offX;
      var y = curY + offY;
      var _sprite = CELL;
      if (!y || y === rows - 1) _sprite = EDGE;
      context.drawImage(_sprite, x * spriteWidth, y * spriteHeight);
    }
  }

  return context.canvas;
}

function eraseMenu(menu, index) {
  var context = menu.context,
      spritesheet = menu.spritesheet,
      cols = menu.cols,
      rows = menu.rows;


  var SIZE = 8 * 4;

  var _spritesheet$list2 = slicedToArray(spritesheet.list, 2),
      CELL = _spritesheet$list2[0],
      EDGE = _spritesheet$list2[1];

  if (isNaN(index)) context.clearRect(0, 0, cols * SIZE, rows * SIZE);else {
    var _fromIndex5 = fromIndex(index, cols / 4),
        _fromIndex6 = slicedToArray(_fromIndex5, 2),
        curX = _fromIndex6[0],
        curY = _fromIndex6[1];

    context.clearRect(curX * SIZE, curY * SIZE, SIZE, SIZE);
  }

  return context.canvas;
}

function clearMenu(menu) {
  var context = menu.context,
      spritesheet = menu.spritesheet,
      cols = menu.cols,
      rows = menu.rows;

  var _spritesheet$sizes4 = slicedToArray(spritesheet.sizes, 2),
      spriteWidth = _spritesheet$sizes4[0],
      spriteHeight = _spritesheet$sizes4[1];

  var _spritesheet$list3 = slicedToArray(spritesheet.list, 1),
      CELL = _spritesheet$list3[0];

  for (var i = cols * (rows - 2); i--;) {
    var _fromIndex7 = fromIndex(i, cols),
        _fromIndex8 = slicedToArray(_fromIndex7, 2),
        x = _fromIndex8[0],
        y = _fromIndex8[1];

    y++;
    context.drawImage(CELL, x * spriteWidth, y * spriteHeight);
  }
  return context.canvas;
}

function fromIndex(index, cols) {
  var x = index % cols;
  var y = (index - x) / cols;
  return [x, y];
}

})));
//# sourceMappingURL=build.js.map
