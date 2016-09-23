/**
 * Created by M.Sharipov on 20/06/16.
 */

define(['...'], function(
    Backbone,
    BaseView,
    CONST,
    BasePopup,
    Model,
    template
) {

    var View = BaseView.extend({

        className: 'billing-popup__content',

        template: _.template(template),

        events: {
            'click [data-ref=goBack]': 'goBack',
            'click [data-ref=cancel]': 'close',
            'click [data-ref=tryAgain]': 'tryAgain'
        },

        initialize: function(options) {
            if(!this.model) {
                throw new Error('model is required');
            }

            options = options ? options : {};
            this.without_delimiters = options.without_delimiters;

            this.listenTo(this.model, 'change:status', this.render);
        },

        beforeRender: function() {
            this.content && this.setView('[data-ref=content]', this.content);
        },

        serialize: function() {
            var json = this.model.toJSON();

            return _.extend(json, {
                without_delimiters: this.without_delimiters
            });
        },

        afterRender: function() {
            this.refs = this.getDependentElements(this.$el);

            switch(this.model.get('status')) {
                case CONST.STATUS.LOAD:
                    this.toggleElement(this.refs.loader, false);
                    this.createSpinner(this.refs.loader[0], 'L');
                    break;
                case CONST.STATUS.SUCCESS:
                    this.toggleElement(this.refs.success, false);
                    setTimeout(function() {
                        Backbone.Events.trigger('popup:remove');
                    }, CONST.AUTO_CLOSE_TIME.S);
                    break;
                case CONST.STATUS.ERROR:
                    this.toggleElement(this.refs.error, false);
                    break;
            }
        },

        goBack: function() {
            this.model.standard();
        },

        tryAgain: function() {
            this.trigger('try_again');
        },

        setContent: function(view) {
            this.content = view;
            this.model.set('status', CONST.STATUS.DEFAULT);
        },

        show: function() {
            var popupModel = new BasePopup.Model({
                width: this.model.get('width'),
                overflowHidden: true,
                isCloseObscurity: true,
                isViewClose: false
            });

            new BasePopup.View({
                model: popupModel,
                contentView: this
            });
        },

        close: function(e) {
            e.preventDefault();
            if(this.model.get('status') !== CONST.STATUS.LOAD) {
                Backbone.Events.trigger('popup:remove');
            }
        }

    });

    return {
        Model: Model,
        View: View
    };


});
