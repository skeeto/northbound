function Display(game, ctx) {
    this.game = game;
    this.showGrid = false;
    this.ctx = ctx;
}

Display.prototype.draw = function() {
    var ctx = this.ctx;
    this.fixup();
    var sprites = this.drawMap();
    sprites = sprites.concat(this.drawUnits());
    sprites.sort(function(a, b) {
        if(a.y > b.y) return 1;
        if(a.y < b.y) return -1;
        return 0;
    }).forEach(function(s) {
        s.render();
    });
    this.drawMessages();
    this.drawStatus();
    this.drawTime();
    this.drawParty();
};

Display.prototype.fixup = function() {
    var ctx = this.ctx;
    var canvas = ctx.canvas,
        $parent = $(canvas.parentNode);
    canvas.width = $parent.width();
    canvas.height = $parent.height();
};

Display.prototype.min = function() {
    return Math.min(this.game.map.edge, this.game.player.y);
};

Display.prototype.max = function() {
    return this._max || 10;
};

Display.prototype.drawMap = function () {
    var ctx = this.ctx;
    var w = ctx.canvas.width,
        h = ctx.canvas.height,
        map = this.game.map,
        s = w / map.width,
        ht = Math.ceil(h / s);
    ctx.strokeStyle = 'gray';

    var sprites = [];
    var min = this.min();
    this._max = min + ht;
    for (var y = min + ht - 1; y >= min; y--) {
        var row = map.get(y),
            yy = h - (y + 1 - min) * s;
        for (var x = 0; x < map.width; x++) {
            var xx = x * s, tile = row[x],
                corrupted = tile.corrupted, cold = tile.cold;
            var base = corrupted ? tile.type.corrupt :
                    cold ? tile.type.snow : tile.type.image;
            if (base) {
                ctx.drawImage(base, xx, yy, s, s);
            }
            var obstacle = tile.obstacle, quest = tile.quest;
            if (obstacle != null || quest != null) {
                var image = null;
                if (obstacle != null) {
                    image = corrupted ? obstacle.corrupt :
                        cold ? obstacle.snow : obstacle.image;
                } else {
                    image = Tile.QUEST.image;
                }
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

Display.prototype.drawUnits = function() {
    var ctx = this.ctx;
    var units = this.game.units,
        map = this.game.map;
    var w = ctx.canvas.width,
        h = ctx.canvas.height,
        s = w / this.game.map.width,
        ht = Math.ceil(h / s);
    var _this = this;
    return units.map(function(u) {
        var y = h - (u.y - _this.min()) * s,
            cold = this.game.map.get(u.y)[u.x].cold;
        return {
            y: y,
            render: function() {
                ctx.font = Math.floor(s) + 'px sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                ctx.drawImage(Tile.SHADOW.image, u.x * s, y - s, s, s);
                ctx.fillStyle = cold ? u.style.cold : u.style.normal;
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

Display.prototype.drawStatus = function() {
    $('#supplies').text(Math.floor(this.game.player.supplies) + ' supplies');
    $('#alignment')
        .text(this.game.alignment())
        .removeClass()
        .addClass('alignment-' + this.game.alignment());
    $('#time').text(this.game.timeString());
};

Display.prototype.drawTime = function() {
    var ctx = this.ctx;
    ctx.save();
    var bright = (Math.cos((this.game.time() + 0.5) * 2 * Math.PI) + 1) / 2;
    ctx.globalAlpha = 0.6 - (Math.sqrt(bright) * 0.6);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
};

Display.prototype.drawParty = function() {
    var fatigue = this.game.fatigue();
    $('#fatigue').text(fatigue.name)
        .removeClass().addClass('fatigue-' + fatigue.ordinal);
    var $party = $('#party').empty();
    this.game.player.party.slice(0).sort().forEach(function(member) {
        $party.append($('<li/>').addClass('member').text(member));
    });
};
