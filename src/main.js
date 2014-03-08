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
    music();

    function step() {
        if (!game.isDone()) {
            game.step(step);
        }
    }
    game.step(step);
});

Array.prototype.shuffle = function(){
    for(var j, x, i = this.length; i;
        j = Math.floor(Math.random() * i),
        x = this[--i], this[i] = this[j], this[j] = x);
    return this;
};

var MUSIC = [
    ["Dark Times.ogg", "Dark Times.mp3"],
    ["Death of Kings.ogg", "Death of Kings.mp3"],
    ["Enchanted Valley.ogg", "Enchanted Valley.mp3"],
    ["End of the Era.ogg", "End of the Era.mp3"],
    ["Lost Frontier.ogg", "Lost Frontier.mp3"],
    ["The Pyre.ogg", "The Pyre.mp3"]
].map(function(song) {
    return song.map(function(file) {
        return 'music/' + file;
    });
});

var howl = null;
function music() {
    var music = MUSIC.shuffle()[0];
    howl = new Howl({
        urls: MUSIC.shuffle()[0],
        autoplay: true,
        loop: false,
        volume: 0.25,
        onend: music
    });
}
