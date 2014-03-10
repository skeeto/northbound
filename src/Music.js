var Music = {};

Music.MUSIC = [
    ["Dark Times.ogg", "Dark Times.mp3"],
    ["Death of Kings.ogg", "Death of Kings.mp3"],
    ["End of the Era.ogg", "End of the Era.mp3"],
    ["Lost Frontier.ogg", "Lost Frontier.mp3"],
    ["The Pyre.ogg", "The Pyre.mp3"]
].map(function(song) {
    return song.map(function(file) {
        return 'music/' + file;
    });
});

Music.howl = null;

Music.playing = function() {
    return Music.howl != null;
};

Music.start = function() {
    if (!Music.playing()) {
        var song = Music.MUSIC.shuffle()[0];
        Music.howl = new Howl({
            urls: song,
            autoplay: true,
            loop: false,
            volume: 0.4,
            onend: music
        });
    }
    $('#music').show();
    $('#mute').hide();
    localStorage.NB_music = 'on';
};

Music.stop = function() {
    if (Music.playing()) {
        Music.howl.stop();
        Music.howl = null;
    }
    $('#music').hide();
    $('#mute').show();
    localStorage.NB_music = 'off';
};

Music.toggle = function() {
    if (!Music.playing()) {
        Music.start();
    } else {
        Music.stop();
    }
};

$(document).ready(function() {
    $('#volume').on('click', Music.toggle);
    if (localStorage.NB_music === 'off') {
        Music.stop();
    } else {
        Music.start();
    }
});
