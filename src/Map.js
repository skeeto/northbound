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

Map.select = function(value, y) {
    if (y < 8) value = Math.pow(value, 8 - y);
    if (value > 0.8) {
        return new Tile(Tile.WATER3);
    } else if (value > 0.75) {
        return new Tile(Tile.WATER2);
    } else if (value > 0.7) {
        return new Tile(Tile.WATER1);
    } else if (value > -0.4) {
        return new Tile(Tile.GRASS);
    } else if (value > -0.6) {
        return new Tile(Tile.SOIL);
    } else if (value > -0.9) {
        return new Tile(Tile.DIRT);
    } else {
        return new Tile(Tile.SAND);
    }
};

Map.bselect = function(value, base, y) {
    if (y < 8) value = Math.pow(value, 8 - y);
    if (value > 0.5) {
        return Tile.MOUNTAIN;
    } else if (value > 0.22) {
        return Tile.TREE;
    } else if (value < -0.2 && base.type === Tile.GRASS) {
        return Tile.TALLGRASS;
    } else {
        return null;
    }
};

Map.SCALE = 25;
Map.TREE_SCALE = 8;

Map.prototype.generate = function(n) {
    while (this.rows.length < n + 1) {
        var row = [], y = this.rows.length;
        for (var x = 0; x < this.width; x++) {
            var tvalue = noise.simplex2(x / Map.SCALE, y / Map.SCALE),
                tile = Map.select(tvalue, y),
                bvalue = noise.perlin2(x / Map.TREE_SCALE, y / Map.TREE_SCALE);
            if (!tile.type.water) {
                tile.obstacle = Map.bselect(bvalue, tile, y);
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
    if (y < 0) return true;
    var tile = this.get(y)[x];
    return tile == null
        || tile.type.solid
        || tile.obstacle != null && tile.obstacle.solid;
};
