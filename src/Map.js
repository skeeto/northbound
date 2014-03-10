function Map() {
    this.rows = [];
    this.edge = -1;
    this.advance();
}

Map.SCALE = 25;
Map.TREE_SCALE = 8;
Map.COLD_SCALE = 16;
Map.COLD_RANGE = 256;
Map.SUPPLY_RATE = 0.01;
Map.prototype.width = 32;

Map.prototype.get = function(y) {
    if (y >= this.rows.length) {
        this.generate(y);
    }
    return this.rows[y];
};

Map.road = function(y, width) {
    var w2 = width / 2, w3 = width / 3;
    return Math.round(w3 * noise.perlin3(0.5, y / 20, 0)) + w2;
};

Map.select = function(value, x, y) {
    var tile = null;
    if (value > 0.8) {
        tile = new Tile(Tile.WATER3);
    } else if (value > 0.75) {
        tile = new Tile(Tile.WATER2);
    } else if (value > 0.7) {
        tile = new Tile(Tile.WATER1);
    } else if (value > -0.4) {
        tile = new Tile(Tile.GRASS);
    } else if (value > -0.6) {
        tile = new Tile(Tile.SOIL);
    } else if (value > -0.9) {
        tile = new Tile(Tile.DIRT);
    } else {
        tile = new Tile(Tile.SAND);
    }
    return tile;
};

Map.cold = function(x, y) {
    var cold = noise.perlin3(x / Map.COLD_SCALE, y / Map.COLD_SCALE, 1.5),
        limit = Math.atan((y - Map.COLD_RANGE) / Map.COLD_RANGE) - 0.3;
     return cold < limit;
};

Map.bselect = function(value, base, x, y) {
    if (value > 0.5) {
        return Tile.MOUNTAIN;
    } else if (value > 0.22) {
        return Tile.TREE;
    } else if (value < -0.2 && base.type === Tile.GRASS && !base.cold) {
        return Tile.TALLGRASS;
    } else {
        return null;
    }
};

Map.prototype.generate = function(n) {
    while (this.rows.length < n + 1) {
        var row = [], y = this.rows.length;
        var road = Map.road(y, this.width),
            lastroad = y > 0 ? this.rows[y - 1].road : road;
        row.road = road;
        var roadmin = Math.min(road, lastroad),
            roadmax = Math.max(road, lastroad);
        for (var x = 0; x < this.width; x++) {
            var tvalue = noise.simplex2(x / Map.SCALE, y / Map.SCALE),
                tile = x >= roadmin && x <= roadmax
                    ? new Tile(Tile.ROAD) : Map.select(tvalue, x, y),
                bvalue = noise.perlin2(x / Map.TREE_SCALE, y / Map.TREE_SCALE);
            tile.cold = Map.cold(x, y);
            if (!tile.type.water && tile.type !== Tile.ROAD) {
                tile.obstacle = Map.bselect(bvalue, tile, x, y);
            }
            if (!tile.obstacle && !tile.type.solid) {
                if (Math.random() < Map.SUPPLY_RATE / (tile.cold ? 2 : 1)) {
                    tile.obstacle = Tile.SUPPLIES;
                }
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
        || (tile.type.solid && (tile.type.water ? !tile.cold : true))
        || tile.obstacle != null && tile.obstacle.solid;
};
