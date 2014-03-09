function Game() {
    this.map = new Map();
    this.count = 0;
    this.player = new Unit(this.map.width / 2, this.map.edge + 4, '@');
    this.player.step = Unit.STEP_PLAYER;
    this.player.party = [];
    this.units = [this.player];
    this._units = null;
    this.messages = [];
}

Game.ADVANCE_RATE = 3;
Game.STORY_RATE = 10;

Game.prototype.step = function(callback) {
    this.count++;
    var storytime = false;
    if (Math.random() < 1 / Game.STORY_RATE) {
        var valid = Story.select(this);
        if (valid.length > 0) {
            var story = valid[Math.floor(Math.random() * valid.length)];
            story.used = true;
            Story.show(story, callback);
            storytime = true;
        }
    }
    if (!storytime) {
        if (this.count % Game.ADVANCE_RATE === 0) {
            this.map.advance();
        }
        this.map.lurk();
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
    return false;
};

Game.prototype.message = function(message, clazz) {
    this.messages.unshift({
        message: message,
        clazz: clazz,
        count: this.count
    });
};
