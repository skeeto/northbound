function Display(game) {
    this.game = game;
    this.showGrid = false;
}

Display.prototype.draw = function(ctx) {
    this.fixup(ctx);
    this.drawMap(ctx);
    this.drawUnits(ctx);
    this.drawMessages();
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
    for (var y = map.edge + ht - 1; y >= map.edge; y--) {
        var row = map.get(y),
            yy = h - (y + 1 - map.edge) * s;
        for (var x = 0; x < map.width; x++) {
            var xx = x * s, tile = row[x], corrupted = tile.corrupted;
            var base = corrupted ? tile.type.corrupt : tile.type.image;
            if (base) {
                ctx.drawImage(base, xx, yy, s, s);
            }
            var obstacle = tile.obstacle;
            if (obstacle != null) {
                var image = corrupted ? obstacle.corrupt : obstacle.image;
                if (image) {
                    var overhang = (image.height - image.width) / image.width;
                    ctx.drawImage(image, xx, yy - overhang * s,
                                  s, s * (1 + overhang));
                }
            }
            if (this.showGrid) {
                ctx.rect(xx, yy, s, s);
                ctx.stroke();
            }
        }
    }
};

Display.prototype.drawUnits = function(ctx) {
    var units = this.game.units,
        map = this.game.map;
    var w = ctx.canvas.width,
        h = ctx.canvas.height,
        s = w / this.game.map.width,
        ht = Math.ceil(h / s);
    ctx.font = Math.floor(s) + 'px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    units.forEach(function(u) {
        ctx.fillStyle = u.style;
        ctx.fillText(u.c, u.x * s, h - (u.y - map.edge) * s);
    });
};

Display.MESSAGE_TTL = 20;

Display.prototype.drawMessages = function() {
    var messages = this.game.messages, i = 0, count = this.game.count;
    $messages.find('.message').each(function() {
        var message = messages[i], $this = $(this);
        if (message != null && count - message.count < Display.MESSAGE_TTL) {
            $this.html(messages[i].message);
            $this.removeClass();
            $this.addClass('message');
            var clazz = messages[i].clazz;
            if (clazz != null) $this.addClass(clazz);
            i++;
        } else {
            $this.html('');
        }
    });
};
