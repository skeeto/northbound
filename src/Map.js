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

Map.prototype.generate = function(n) {
    while (this.rows.length < n + 1) {
        var row = [];
        for (var i = 0; i < this.width; i++) {
            var tile = new Tile(Tile.GRASS);
            if (Math.random() < 0.1) {
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
