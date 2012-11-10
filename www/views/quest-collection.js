pp.views.QuestCollection = Backbone.View.extend({

    tag: 'div',

    template: _.template($('#template-quest-collection').text()),

    initialize: function () {
        this.options.quests.on('reset', this.onReset, this);
        this.options.quests.on('update', this.render, this);
        this.render();
    },

    render: function (collection) {
        this.$el.html(this.template({hasQuests: this.options.quests.models.length}));
        return this;
    },

    onAdd: function (quest) {
        var view = new pp.views.Quest({model: quest});
        var ql = this.$el.find('.quests-list');
        ql.show(); // quests table is hidden initially - see https://github.com/berekuk/play-perl/issues/61
        ql.append(view.render().el);
    },

    onReset: function () {
        this.options.quests.each(this.onAdd, this);
    }
});
