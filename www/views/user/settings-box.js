// Here's the problem with modal views: you can't re-render them.
// Because when they have an internal state (background fade), and rendering twice means that you won't be able to close your modal, or it won't render at all.
// I'm not sure I understand it completely, but... I had problems with that.
//
// Also, separating modal view logic is a Good Thing in any case. This view can become 'pp.View.Modal' in the future.
pp.views.UserSettingsBox = pp.View.Common.extend({
    events: {
        'click .btn-primary': 'submit'
    },

    t: 'user-settings-box',

    subviews: {
        '.settings-subview': function () {
            return new pp.views.UserSettings({ model: this.model });
        }
    },

    afterInitialize: function() {
        this.setElement($('#user-settings')); // settings-box is a singleton
    },

    start: function () {
        this.subview('.settings-subview').start();
        this.render();
        this.$('.modal').modal('show');
        this.model.fetch();
    },

    submit: function() {
        var that = this;

        this.subview('.settings-subview').save({
            success: function() {
                that.$('.modal').modal('hide');

                // Just to be safe.
                // Also, if email was changed, we want to trigger the 'sync' event and show the notify box.
                pp.app.user.fetch();
            },
            failure: function() {
                alert('modal submit failed!');
            }
        });
    },
});
