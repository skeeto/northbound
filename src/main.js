var game = null,
    display = null,
    ctx = null,
    $messages = null;

function start() {
    noise.seed(Math.random());
    ctx = $('#map').get(0).getContext('2d');
    game = new Game();
    display = new Display(game, ctx);
    $messages = $('#messages');
    $(window).resize(function() {
        display.draw();
    });
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

$(document).ready(start);

Tile.tiles.forEach(function(image) {
    image.onload = function() {
        display.draw();
    };
});
