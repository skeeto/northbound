function Game() {
    this.map = new Map();
    this.player = new Unit(this.map.width / 2, this.map.edge + 4, '@');
    this.player.step = Unit.STEP_PLAYER;
    this.units = [this.player];
    this._units = null;
}

Game.prototype.step = function(callback) {
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
