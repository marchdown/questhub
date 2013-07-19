define [
    "underscore", "jquery", "markdown"
    "views/proto/any-collection"
    "models/current-user"
    "views/user/signin", "views/comment/any"
    "views/helper/textarea"
    "text!templates/comment-collection.html"
], (_, $, markdown, AnyCollection, currentUser, Signin, Comment, Textarea, html) ->
    class extends AnyCollection
        template: _.template(html)
        events:
            "click .submit": "postComment"

        subviews:
            ".signin": ->
                new Signin()
            ".comment-add-sv": ->
                new Textarea
                    realm: @options.realm
                    placeholder: "Comment (Markdown syntax supported)"

        textarea: -> @subview ".comment-add-sv"

        serialize: ->
            currentUser: currentUser.get("login")

        generateItem: (model) ->
            new Comment(
                model: model
                realm: @options.realm
                quest: @options.quest
            )

        listSelector: ".comments-list"

        initialize: ->
            @listenTo @collection, "add", @resetForm
            @listenTo @options.quest, "compose-comment", @composeComment
            super

        render: ->
            super
            return unless @activated
            @textarea().reveal()
            @textarea().on "edit", @validate
            @textarea().on "save", @postComment

            if @options.reply
                @options.quest.trigger "compose-comment", reply: @options.reply
                @options.reply = false

# we could clean the comment on cancel, but it would be too annoying to lose your data accidentally
# TODO - think through if this is useful
#            @textarea().on "cancel", @resetForm


        # set the appropriate "add comment" button style
        validate: (e) =>
            text = @textarea().value()
            @$(".submit").toggleClass "disabled", !text

        disableForm: =>
            return unless @activated
            @textarea().disable()
            @$(".submit").addClass "disabled"

        resetForm: =>
            return unless @activated
            console.log "resetForm"
            @textarea().enable()
            @textarea().clear()
            @validate()

        enableForm: =>
            return unless @activated
            # the difference from resetForm() is that we don't clear textarea's val() to prevent the comment from vanishing
            @textarea.enable()
            @validate()

        postComment: =>
            return if @$(".submit").hasClass("disabled")
            @disableForm()
            ga "send", "event", "comment", "add"
            mixpanel.track "add comment"
            @collection.createTextComment @textarea().value(),
                wait: true
                error: @enableForm

        composeComment: (opt) ->
            @textarea().reveal("@#{opt.reply}: ")
            console.log @$('.comment-add').offset().top
            @textarea
            $('html, body').animate {
                scrollTop: @$('.comment-add').offset().top
            }, {
                complete: => @textarea().focus()
            }

# on success, 'add' will fire and form will be resetted
