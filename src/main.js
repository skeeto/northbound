var game = null,
    display = null,
    ctx = null,
    $messages = null;

function init() {
    ctx = $('#map').get(0).getContext('2d');
    $messages = $('#messages');
    $(window).resize(function() {
        display.draw();
    });
}

function intro() {
    game = new Game();
    game.introMode = true;
    display = new Display(game, ctx);
    function step() {
        game.step(step);
    }
    game.step(step);
}

function start() {
    game.kill = true;
    game = new Game();
    display = new Display(game, ctx);
    Story.load();
    game.message('Escape northward!');

    function step() {
        game.step(step);
    }
    game.step(step);
}

Array.prototype.shuffle = function() {
    for(var j, x, i = this.length; i;
        j = Math.floor(Math.random() * i),
        x = this[--i], this[i] = this[j], this[j] = x);
    return this;
};

$(document).ready(function() {
    init();
    intro();
});

Tile.tiles.forEach(function(image) {
    image.onload = function() {
        display.draw();
    };
});
