function Tile(type) {
    this.type = type;
    this.obstacle = null;
}

Tile.tiles = [];

Tile.get = function(src) {
    var image = new Image();
    image.src = 'img/' + src;
    Tile.tiles.push(image);
    return image;
};

Tile.CORRUPTION = Tile.get('tiles/water3.png');
Tile.GRASS = Tile.get('tiles/grass1.png');
Tile.DIRT = Tile.get('tiles/dirt1.png');
Tile.SAND = Tile.get('tiles/sand1.png');
Tile.SOIL = Tile.get('tiles/soil1.png');
Tile.WATER1 = Tile.get('tiles/water1.png');
Tile.WATER2 = Tile.get('tiles/water2.png');
Tile.WATER3 = Tile.get('tiles/water3.png');

Tile.TREE = Tile.get('trees/Tree1.png');
