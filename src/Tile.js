function Tile(type) {
    this.type = type;
    this.obstacle = null;
    this.corrupted = false;
}

Tile.tiles = [];

Tile.corruptImage = function(image) {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
        data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var r = data[i+0], g = data[i+1], b = data[i+2];
        var wash = (r + g + b) / 4;
        data[i+0] = data[i+1] = data[i+2] = Math.floor(wash);
    }
    ctx.putImageData(imageData, 0, 0);
    var out = new Image();
    out.src = canvas.toDataURL();
    return out;
};

Tile.get = function(src) {
    var image = new Image();
    image.src = 'img/' + src;
    Tile.tiles.push(image);
    var tile = {image: image};
    image.addEventListener('load', function() {
        tile.corrupt = Tile.corruptImage(image);
    });
    return tile;
};

Tile.GRASS = Tile.get('tiles/grass1.png');
Tile.DIRT = Tile.get('tiles/dirt1.png');
Tile.SAND = Tile.get('tiles/sand1.png');
Tile.SOIL = Tile.get('tiles/soil1.png');
Tile.WATER1 = Tile.get('tiles/water1.png');
Tile.WATER2 = Tile.get('tiles/water2.png');
Tile.WATER3 = Tile.get('tiles/water3.png');

Tile.TREE = Tile.get('trees/Tree1.png');
