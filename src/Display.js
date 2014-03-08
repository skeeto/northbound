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
        s = w / this.map.width;
    ctx.strokeStyle = 'gray';
    for (var y = 0; y * s < h + 1; y++) {
        var row = this.map.get(y);
        for (var x = 0; x < this.map.width; x++) {
            ctx.fillStyle = row[x].type;
            ctx.fillRect(x * s, y * s, s, s);
            ctx.rect(x * s, y * s, s, s);
            ctx.stroke();
        }
    }
};
