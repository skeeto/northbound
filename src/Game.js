function Game() {
    this.map = new Map();
    this.count = 0;
    this.player = new Unit(this.map.width / 2, this.map.edge + 4, '@');
    this.player.step = Unit.STEP_PLAYER;
    this.player.party = [];
    this.player.supplies = 100;
    this.player.items = [];
    this.storyState = {};
    this.units = [this.player];
    this._units = null;
    this.messages = [];
}

Game.ADVANCE_RATE = 3;
Game.STORY_RATE = 10;

Game.randomIndex = function(arr) {
    return Math.floor(Math.random() * arr.length);
};

Game.randomChoice = function(arr) {
    return arr[Game.randomIndex(arr)];
};

Game.prototype.inCorruption = function() {
    var row = this.map.get(this.player.y);
    var tile = row[this.player.x];
    return tile.corrupted;
};

Game.prototype.setStoryState = function(story, state) {
    this.storyState[story] = state;
};

Game.prototype.getStoryState = function(story) {
    return this.storyState[story] || false;
};

Game.prototype.step = function(callback) {
    if (game.isDone()) {
        game.showEnd();
        return;
    }

    this.count++;
    var storytime = false;
    if (Math.random() < 1 / Game.STORY_RATE) {
        var valid = Story.select(this);
        if (valid.length > 0) {
            var story = Game.randomChoice(valid);
            story.used = true;
            display.draw(ctx);
            Story.show(story, callback);
            storytime = true;
        }
    }
    if (!storytime) {
        if (this.count % Game.ADVANCE_RATE === 0) {
            this.map.advance();
        }
        this.map.lurk();
        var inCorruption = this.inCorruption();
        this.player.supplies
            -= this.player.party.length * inCorruption ? 3 : 0.2;
        if (this.player.supplies < 0) {
            this.player.supplies = 0;
            if (Math.random() > 0.25) {
                var party = this.player.party.shuffle();
                if (party.length === 0) {
                    this.message('You have starved to death!', 'danger');
                    this.end();
                    callback();
                } else {
                    var dead = party.pop();
                    this.message(dead + ' has starved to death!', 'danger');
                }
            }
        }
        var playertile = this.map.get(this.player.y)[this.player.x];
        if (playertile.obstacle === Tile.SUPPLIES) {
            playertile.obstacle = null;
            var count = Math.random() * 4 + 2;
            this.player.supplies += count;
            this.message('You pick up ' + Math.round(count) + ' supplies.',
                         'noise');
        }
        this._units = this.units.slice(0);
        this._step(callback);
    }
};

Game.prototype._step = function(callback) {
    var _this = this;
    while (this._units.length > 0) {
        var next = this._units.shift(),
            result = next.step(function() {
                _this._step(callback);
            });
        if (!result) {
            return;  // async
        }
    }
    callback();
    return;
};

Game.prototype.isDone = function() {
    return this.gameOver;
};

Game.prototype.message = function(message, clazz) {
    this.messages.unshift({
        message: message,
        clazz: clazz,
        count: this.count
    });
    if (clazz === 'danger') {
        Sfx.play('notify');
    }
};

/** @returns {number} distance player has traveled in miles */
Game.prototype.distance = function() {
    return this.player.y * 30 / 5280;
};

Game.prototype.end = function() {
    this.gameOver = true;
};

Game.prototype.showEnd = function() {
    if (!this.endShown) {
        this.endShown = true;
        Sfx.play('gameover');
        $('#gameover .distance').text(this.distance().toFixed(2));
        $('#gameover').show();
    }
    display.draw(ctx);
};
