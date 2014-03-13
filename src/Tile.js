function Tile(type) {
    this.type = type;
    this.obstacle = null;
    this.corrupted = false;
    this.cold = false;
}

Tile.tiles = [];

Tile.filter = function(image, fn) {
    var canvas = document.createElement('canvas'),
        w = canvas.width = image.width,
        h = canvas.height = image.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
        data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var c = fn([data[i+0], data[i+1], data[i+2], data[i+3]],
                   w, h, Math.floor(i / 4) % w, Math.floor(i / 4 / w));
        data[i+0] = c[0];
        data[i+1] = c[1];
        data[i+2] = c[2];
        data[i+3] = c[3];
    }
    ctx.putImageData(imageData, 0, 0);
    var out = new Image();
    out.src = canvas.toDataURL();
    return out;
};

Tile.get = function(src, props) {
    props = props || {};
    var image = new Image();
    image.src = 'img/' + src;
    Tile.tiles.push(image);
    var tile = {image: image};
    image.addEventListener('load', function() {
        tile.corrupt = Tile.filter(image, function(c) {
            var ave = (c[0] + c[1] + c[2]) / 4;
            return [ave, ave, ave, c[3]];
        });
        if (props.obstacle) {
            tile.snow = Tile.filter(image, function(c, w, h, x, y) {
                var add = 128 + 192 * (1 - y / h);
                return [
                    c[0] + add - 128,
                    c[1] + add - 128,
                    c[2] + add - 128,
                    c[3]
                ];
            });
        } else if (props.water) {
            tile.snow = Tile.filter(image, function(c) {
                var tint = 64;
                var ave = (c[0] + c[1] + c[2]) / 1.25;
                return [ave - tint, ave - tint, ave + tint, c[3]];
            });
        } else {
            tile.snow = Tile.filter(image, function(c) {
                var ave = (c[0] + c[1] + c[2]) / 1.25;
                return [ave, ave, ave, c[3]];
            });
        }
    });
    if (props != null) {
        $.extend(tile, props);
    }
    return tile;
};

/* Terrain types. */
Tile.GRASS = Tile.get('tiles/grass1.png');
Tile.ROAD = Tile.get('tiles/road1.png', {road: true});
Tile.DIRT = Tile.get('tiles/dirt1.png');
Tile.SAND = Tile.get('tiles/sand1.png');
Tile.SOIL = Tile.get('tiles/soil1.png');
Tile.WATER1 = Tile.get('tiles/water1.png', {solid: false, water: true});
Tile.WATER2 = Tile.get('tiles/water2.png', {solid: true, water: true});
Tile.WATER3 = Tile.get('tiles/water3.png', {solid: true, water: true});

/* Obstacle types. */
Tile.TREE = Tile.get('trees/Tree1.png', {
    solid: true,
    obstacle: true
});
Tile.MOUNTAIN = Tile.get('mountain.png', {
    solid: true,
    obstacle: true
});
Tile.TALLGRASS = Tile.get('tallgrass.png', {
    solid: false,
    obstacle: true
});
Tile.SUPPLIES = Tile.get('crates.png', {
    solid: false,
    obstacle: true,
    supplies: true
});

/* Misc */
Tile.SHADOW = Tile.get('shadow.png');
Tile.QUEST = Tile.get('quest.png');
