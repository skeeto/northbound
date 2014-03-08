var game = null,
    display = null,
    ctx = null,
    $messages = null;

$(document).ready(function() {
    game = new Game();
    display = new Display(game);
    $messages = $('#messages');
    ctx = $('#map').get(0).getContext('2d');
    $(window).resize(function() {
        display.draw(ctx);
    });
    game.message('Escape northward!');

    function step() {
        if (!game.isDone()) {
            game.step(step);
        }
    }
    game.step(step);
});
