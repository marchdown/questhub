define([
    'models/comment',
    'views/comment/text'
], function (CommentModel, CommentText) {
    describe('comments render', function () {
        var model = new CommentModel({
            "body" : "aaa",
            "ts" : 1363395653,
            "body_html" : "aaa\n",
            "quest_id" : "5143c351dd3d73910c00000e",
            "author" : "ooo",
            "type": "text"
        });
        var view = new CommentText({ model: model });

        view.render();
        it('comment body', function () {
            expect(view.$el.html()).toContain('aaa');
        });

        it('comment author', function () {
            expect(view.$el.html()).toContain('ooo');
        });
    });
});
