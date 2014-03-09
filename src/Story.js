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
    newmember: function(name) {
        game.player.party.push(name);
        game.message(name + ' joins your party.');
        Sfx.play('get');
    },
    remove: function(name) {
        game.player.party = game.player.party.filter(function(member) {
            return name !== member;
        });
        game.message(name + ' leaves your party.');
        Sfx.play('thwart');
    },
    gold: function(n) {
        game.player.gold += n;
    },
    karma: function(n) {
        game.player.karma += n;
    },
    supplies: function(n) {
        game.player.supplies += n;
    },
    advance: function(n) {
        for (var i = 0; i < n; i++) {
            game.map.advance();
        }
    },
    play: function(name, volume) {
        Sfx.play(name, volume);
    }
};

Story.filters = {
    hasPeople: function(people) {
        return people.every(function(person) {
            return game.player.party.indexOf(person) >= 0;
        });
    },

    minParty: function(number) {
        return game.player.party.length >= number;
    }
};

Story.filter = function(activeFilters) {
    return activeFilters.every(function(filterSpec) {
        return Story.filters[filterSpec[0]].apply(null, filterSpec.slice(1));
    });
};

Story.show = function(story, callback) {
    Sfx.play('story');
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
            Story.act(option, callback);
        });
    });
    $('#story .close').hide();
    $('#story').show();
};

Story.act = function(option, callback) {
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
        if (callback != null) {
            callback();
        }
    });
};

Story.select = function(game) {
    if (Story.stories == null) {
        return [];
    }
    return Story.stories.filter(function(story) {
        return !story.used && (!story.filter || Story.filter(story.filter));
    });
};
