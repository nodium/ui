module.exports = function (Nodium) {

    'use strict';

    var _ = Nodium.context._,
    	mercury = require('mercury');

    Nodium.createView = function (object) {

        // inject any sane defaults here
        var defaults,
        	Component;

        defaults = {
            getInitialState: function () { return {} }
        };

        Component = function (options) {

        	return mercury.state(_.merge({}, defaults, object.getInitialState(), options));
        };

        _.forIn(object, function (value, key) {
        	Component[key] = value;
        });

        return Component;
    };
};