function Map() {
    this.rows = [];
}

Map.prototype.width = 32;

Map.prototype.get = function(n) {
    if (n > this.rows.length) {
        this.generate(n);
    }
    return this.rows[n];
};

Map.prototype.generate = function(n) {
    while (this.rows.length < n + 1) {
        var row = [];
        for (var i = 0; i < this.width; i++) {
            row.push(new Tile(Tile.GRASS));
        }
        this.rows.push(row);
    }
};
