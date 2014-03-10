function Display(game) {
    this.game = game;
    this.showGrid = false;
}

Display.prototype.draw = function(ctx) {
    this.fixup(ctx);
    var sprites = this.drawMap(ctx);
    sprites = sprites.concat(this.drawUnits(ctx));
    sprites.sort(function(a, b) {
        if(a.y > b.y) return 1;
        if(a.y < b.y) return -1;
        return 0;
    }).forEach(function(s) {
        s.render();
    });
    this.drawMessages();
    this.drawHUD();
};

Display.prototype.fixup = function(ctx) {
    var canvas = ctx.canvas,
        $parent = $(canvas.parentNode);
    canvas.width = $parent.width();
    canvas.height = $parent.height();
};

Display.prototype.min = function() {
    return Math.min(this.game.map.edge, this.game.player.y);
};

Display.prototype.drawMap = function (ctx) {
    var w = ctx.canvas.width,
        h = ctx.canvas.height,
        map = this.game.map,
        s = w / map.width,
        ht = Math.ceil(h / s);
    ctx.strokeStyle = 'gray';

    var sprites = [];
    var min = this.min();
    for (var y = min + ht - 1; y >= min; y--) {
        var row = map.get(y),
            yy = h - (y + 1 - min) * s;
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
                    var render = (function(xx, yy, image, overhang) {
                        ctx.drawImage(image, xx, yy - overhang * s,
                                      s, s * (1 + overhang));
                    }).bind(this, xx, yy, image, overhang);

                    sprites.push({
                        y: yy + overhang * s,
                        render: render
                    });
                }
            }
            if (this.showGrid) {
                ctx.rect(xx, yy, s, s);
                ctx.stroke();
            }
        }
    }
    return sprites;
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
    var _this = this;
    return units.map(function(u) {
        var y = h - (u.y - _this.min()) * s;
        return {
            y: y,
            render: function() {
                ctx.drawImage(Tile.SHADOW.image, u.x * s, y - s, s, s);
                ctx.fillStyle = u.style;
                ctx.fillText(u.c, u.x * s, y);
            }
        };
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

Display.prototype.drawHUD = function() {
    $('#supplies').text(Math.floor(this.game.player.supplies) + ' supplies');
};
