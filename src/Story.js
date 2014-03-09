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

Story.show = function(story) {
    var title = story.title,
        description = story.description.replace(/\n/g, '</p><p>');
    $('#story .title').html(title);
    $('#story .description').html('<p>' + description + '</p>');
    var $options = $('#options');
    $options.empty();
    story.options.forEach(function(option) {
        var $option = $('<li/>').addClass('option');
        $option.html(option.answer);
        $options.append($option);
        $option.on('click', function() {
            Story.act(option);
        });
    });
    $('#story .close').hide();
    $('#story').show();
};

Story.act = function(option) {
    $('#story .description').html(option.result);
    if (option.scripts) {
        option.scripts.forEach(function(script) {
            if (typeof script === "string") {
                Story.scripts[script]();
            } else {
                Story.scripts[script[0]].apply(null, script.slice(1));
            }
        });
    }
    $('#options').empty();
    $('#story .close').show().on('click', function() {
        $('#story .close').hide().off('click');
        $('#story').hide();
    });
};
