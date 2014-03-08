var game = null,
    display = null,
    ctx = null;

$(document).ready(function() {
    game = new Game();
    display = new Display(game);
    ctx = $('#map').get(0).getContext('2d');
    $(window).resize(function() {
        display.draw(ctx);
    });

    function step() {
        if (!game.isDone()) {
            game.step(step);
        }
    }
    game.step(step);
});
