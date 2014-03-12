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

Music.music = null;
Music.wind = null;
Music.playing = false;

Music.playing = function() {
    return Music._playing;
};

Music.start = function() {
    if (!Music.playing()) {
        var song = Music.MUSIC.shuffle()[0];
        Music.music = new Howl({
            urls: song,
            autoplay: true,
            loop: false,
            volume: 0.4,
            onend: Music.next
        });
        Music.wind = new Howl({
            urls: ['sfx/wind.ogg', 'sfx/wind.mp3'],
            autoplay: true,
            loop: true,
            volume: 0.10
        });
        Music._playing = true;
    }
    $('#music').show();
    $('#mute').hide();
    localStorage.NB_music = 'on';
};

Music.stop = function() {
    if (Music.playing()) {
        Music.music.stop();
        Music.wind.stop();
        Music.music = null;
        Music.wind = null;
        Music._playing = false;
    }
    $('#music').hide();
    $('#mute').show();
    localStorage.NB_music = 'off';
};

Music.next = function() {
    Music.stop();
    Music.start();
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
