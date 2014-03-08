var map = null,
    display = null,
    ctx = null;

$(document).ready(function() {
    map = new Map();
    display = new Display(map);
    ctx = $('#map').get(0).getContext('2d');
    display.draw(ctx);
    $(window).resize(function() {
        display.draw(ctx);
    });
});
