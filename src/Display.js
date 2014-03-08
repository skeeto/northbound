function Display(map) {
    this.map = map;
}

Display.prototype.draw = function(ctx) {
    var canvas = ctx.canvas,
        $parent = $(canvas.parentNode);
    canvas.width = $parent.width();
    canvas.height = $parent.height();
    var w = canvas.width,
        h = canvas.height,
        s = w / this.map.width,
        ht = Math.ceil(h / s);
    ctx.strokeStyle = 'gray';
    for (var y = this.map.edge; y - this.map.edge < ht; y++) {
        var row = this.map.get(y),
            yy = h - (y + 1) * s;
        for (var x = 0; x < this.map.width; x++) {
            var xx = x * s;
            ctx.fillStyle = row[x].type;
            ctx.fillRect(xx, yy, s, s);
            ctx.rect(xx, yy, s, s);
            ctx.stroke();
        }
    }
};
