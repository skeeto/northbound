function Game() {
    this.map = new Map();
    this.count = 0;
    var y = this.map.edge + 4,
        row = this.map.get(y),
        x = null;
    for (x = 0; x < row.length; x++) {
        if (row[x].type === Tile.ROAD) break;
    }
    this.player = new Unit(x, y, '@');
    this.player.step = Unit.STEP_PLAYER;
    this.player.party = [];
    this.player.supplies = 100;
    this.player.items = [];
    this.player.fatigue = 0;
    this.advanceQueue = 0;
    this.storyQueue = [];
    this.storyState = {};
    this.units = [this.player];
    this._units = null;
    this.messages = [];
}

Game.ADVANCE_RATE = 3;
Game.STORY_RATE = 25;
Game.STORY_PROBABILITY = 0.05;

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
    if (this.kill) return;
    if (!this.introMode && this.isDone()) {
        this.showEnd();
        return;
    } else if (this.advanceQueue > 0) {
        this.advanceQueue--;
        display.draw();
        this.map.advance();
        window.setTimeout(callback, 100);
        return;
    }
    this.player.party.shuffle();
    this.count++;

    var storytime = false;
    if (this.storyQueue.length > 0) {
        var story = this.storyQueue.shift();
        story.used = true;
        display.draw();
        Story.show(story, callback);
        storytime = true;
    }

    if (!storytime && !this.introMode && Math.random() < 1 / Game.STORY_RATE) {
        var valid = Story.select().filter(function(s) {
            var p = s.probability;
            return Math.random() < (p != null ? p : Game.STORY_PROBABILITY);
        });
        if (valid.length > 0) {
            var story = Game.randomChoice(valid);
            story.used = true;
            display.draw();
            Story.show(story, callback);
            storytime = true;
        }
    }
    if (!storytime) {
        if (this.count % Game.ADVANCE_RATE === 0) {
            this.map.advance();
        }
        this.map.lurk();
        var fatigue = this.fatigue();
        if (fatigue.ordinal >= 4 && this.player.fatigue % 10 === 0) {
            Sfx.play('alarm', 0.5);
        }
        var loss = fatigue.value * (1 + this.player.party.length) *
                (this.inCorruption() ? 3 : 0.2);
        this.player.supplies -= loss;
        if (this.player.supplies < 0) {
            this.player.supplies = 0;
        }
        var playertile = this.map.get(this.player.y)[this.player.x];
        if (playertile.obstacle === Tile.SUPPLIES) {
            playertile.obstacle = null;
            var count = Math.random() * 8 + 4;
            this.player.supplies += count;
            this.message('You pick up ' + Math.round(count) + ' supplies.',
                         'noise');
            Sfx.play('collect');
        } else if (!this.introMode && playertile.quest != null) {
            var quest = playertile.quest;
            playertile.quest = null;
            Story.show(quest, callback);
            return;
        }
        if (!this.introMode) {
            this._units = this.units.slice(0);
            this._step(callback);
        } else {
            window.setTimeout(callback, 200);
            this.player.y = this.map.edge;
            display.draw();
        }
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

Game.prototype.end = function(state) {
    this.gameOver = state;
};

Game.prototype.showEnd = function() {
    if (!this.endShown) {
        this.endShown = true;
        if (this.gameOver == 'win') {
            Sfx.play('gameover');
            $('#gamewin').show();
        } else {
            Sfx.play('gameover');
            $('#gameover').show();
        }
        $('.endgame .distance').text(this.distance().toFixed(2));
    }
    display.draw();
};

Game.prototype.alignment = function() {
    var value = this.player.karma;
    if (value > 100) {
        return 'Angelic';
    } else if (value >= 50) {
        return 'Good';
    } else if (value >= 10) {
        return 'Honorable';
    } else if (value <= -100) {
        return 'Sociopath';
    } else if (value <= -50) {
        return 'Evil';
    } else if (value <= -10) {
        return 'Dishonorable';
    } else {
        return 'Neutral';
    }
};

Game.TIMESCALE = 480;

/**
 * @returns {number} the time of day between 0 and 1, 0 being midnight
 */
Game.prototype.time = function() {
    var scale = Game.TIMESCALE;
    return ((this.count + scale / 2) % scale) / scale;
};

Game.prototype.timeString = function() {
    var time = this.time(),
        hour = Math.floor(time * 24),
        minute = Math.floor((time % (1 / 24)) * 60 * 24),
        m = hour < 12 ? 'am' : 'pm',
        h12 = (hour % 12) == 0 ? '12' : hour % 12;
    if (minute < 10) minute = '0' + minute;
    return h12 + ':' + minute + m;
};

/** Number of turns recovered by resting once. */
Game.FATIGUE_RECOVERY = 15;

Game.FATIGUE = {
    RESTED:    { ordinal: 0, name: 'Rested',    value: 0.5 },
    WARMED_UP: { ordinal: 1, name: 'Warmed Up', value: 1   },
    TIRED:     { ordinal: 2, name: 'Tired',     value: 1.5 },
    WEARY:     { ordinal: 3, name: 'Weary',     value: 2   },
    EXHAUSTED: { ordinal: 4, name: 'Exhausted', value: 4   }
};

Game.prototype.fatigue = function() {
    var fatigue = this.player.fatigue; /* turn counter */
    if (fatigue >= 110) {
        return Game.FATIGUE.EXHAUSTED;
    } else if (fatigue >= 75) {
        return Game.FATIGUE.WEARY;
    } else if (fatigue >= 50) {
        return Game.FATIGUE.TIRED;
    } else if (fatigue >= 10) {
        return Game.FATIGUE.WARMED_UP;
    } else {
        return Game.FATIGUE.RESTED;
    }
};
