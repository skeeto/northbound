function Story() {
}

Story.stories = null;

Story.load = function() {
    $.get('src/stories.yaml', function(data) {
        Story.stories = jsyaml.load(data);
    });
};

Story.load();

Story.scripts = {
    newmember: function() {
        game.message('You gain a new party member.');
    },
    gold: function(n) {
        game.player.gold += n;
    },
    karma: function(n) {
        game.player.karma += n;
    }
};
