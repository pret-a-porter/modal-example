/**
 * Created by M.Sharipov on 20/08/16.
 */

define(['...'], function(
    Backbone,
    CONST
) {

    return Backbone.Model.extend({

        defaults: {
            title: '',
            width: 500,
            status: CONST.STATUS.LOAD,
            error_prefix: null,
            errors: []
        },

        load: function() {
            this.set('status', CONST.STATUS.LOAD);
        },

        success: function() {
            this.set('status', CONST.STATUS.SUCCESS);
        },

        error: function(error) {
            error && this.set('errors', [error]);
            this.set('status', CONST.STATUS.ERROR);
        },

        standard: function() {
            this.set('status', CONST.STATUS.DEFAULT);
        },

        setErrors: function(errors) {
            var errorPrefix = this.get('error_prefix');

            if(errorPrefix) {
                errors = _.map(errors, function(error) {
                    return __(errorPrefix+error);
                });
            }

            this.set('errors', errors);
        },

        responseHandler: function(response, options) {
            var context;

            options = options ? options : {};
            context = options.context ? options.context : this;

            this.setErrors(response.errors);

            if(response.success === CONST.RESPONSE_STATUS.SUCCESS) {
                this.success();
                if(options.success) {
                    options.success.call(context, response.data);
                }
            } else {
                this.error();
                if(options.error) {
                    options.error.call(context);
                }
            }

        }

    });

});
