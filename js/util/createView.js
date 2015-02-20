/**
 * This file is part of the Nodium UI package
 *
 * (c) Niko van Meurs & Sid Mijnders
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @author Niko van Meurs <nikovanmeurs@gmail.com>
 * @author Sid Mijnders
 */
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

        Component = function (options, kernel) {

            var state = _.chain({})
                .merge(defaults, object.getInitialState(), options)
                .forIn(function (value, key) {
                    value = mercury.value(value)
                })
                .value();

            return mercury.state(state);
        };

        _.forIn(object, function (value, key) {
            Component[key] = value;
        });

        return Component;
    };
};
