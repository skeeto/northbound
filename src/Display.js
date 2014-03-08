function Display(game) {
    this.game = game;
}

Display.prototype.draw = function(ctx) {
    this.fixup(ctx);
    this.drawMap(ctx);
    this.drawUnits(ctx);
};

Display.prototype.fixup = function(ctx) {
    var canvas = ctx.canvas,
        $parent = $(canvas.parentNode);
    canvas.width = $parent.width();
    canvas.height = $parent.height();
};

Display.prototype.drawMap = function (ctx) {
    var w = ctx.canvas.width,
        h = ctx.canvas.height,
        map = this.game.map,
        s = w / map.width,
        ht = Math.ceil(h / s);
    ctx.strokeStyle = 'gray';
    for (var y = map.edge; y - map.edge < ht; y++) {
        var row = map.get(y),
            yy = h - (y + 1) * s;
        for (var x = 0; x < map.width; x++) {
            var xx = x * s;
            ctx.fillStyle = row[x].type;
            ctx.fillRect(xx, yy, s, s);
            //ctx.rect(xx, yy, s, s);
            //ctx.stroke();
        }
    }
};

Display.prototype.drawUnits = function(ctx) {
    var units = this.game.units;
    var w = ctx.canvas.width,
        h = ctx.canvas.height,
        s = w / this.game.map.width,
        ht = Math.ceil(h / s);
    ctx.font = Math.floor(s) + 'px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    units.forEach(function(u) {
        ctx.fillStyle = u.style;
        ctx.fillText(u.c, u.x * s, h - (u.y + 1) * s);
    });
};
