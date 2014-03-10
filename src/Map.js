function Map() {
    this.rows = [];
    this.edge = -1;
    this.advance();
}

Map.prototype.width = 32;

Map.prototype.get = function(n) {
    if (n >= this.rows.length) {
        this.generate(n);
    }
    return this.rows[n];
};

Map.SCALE = 8;

Map.prototype.generate = function(n) {
    while (this.rows.length < n + 1) {
        var row = [], y = this.rows.length;
        for (var x = 0; x < this.width; x++) {
            var tile = new Tile(Tile.GRASS);
            var limit = y < 10 ? (10 - y) : 0.25;
            if (noise.perlin2(x / Map.SCALE, y / Map.SCALE) > limit) {
                tile.obstacle = Tile.TREE;
            }
            row.push(tile);
        }
        this.rows.push(row);
    }
};

Map.prototype.advance = function() {
    var edge = ++this.edge,
        row = this.get(edge);
    for (var x = 0; x < row.length; x++) {
        row[x].corrupted = true;
    }
};

Map.prototype.lurk = function() {
    var lurk = this.edge + 1,
        row = this.get(lurk);
    for (var x = 0; x < row.length; x++) {
        if (Math.random() < 0.1) {
            row[x].corrupted = true;
        }
    }
};

Map.prototype.isSolid = function(x, y) {
    var tile = this.get(y)[x];
    return tile == null || tile.obstacle != null && tile.obstacle.solid;
};
