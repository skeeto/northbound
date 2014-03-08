function Game() {
    this.map = new Map();
    this.count = 0;
    this.player = new Unit(this.map.width / 2, this.map.edge + 4, '@');
    this.player.step = Unit.STEP_PLAYER;
    this.units = [this.player];
    this._units = null;
    this.messages = [];
}

Game.prototype.step = function(callback) {
    this.count++;
    if (this.count % 3 === 0) {
        this.map.advance();
    }
    this.map.lurk();
    this._units = this.units.slice(0);
    this._step(callback);
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
