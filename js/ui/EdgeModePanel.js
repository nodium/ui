/**
 * This file is part of the Nodium core package
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
module.exports = function (Nodium, $, undefined) {

    'use strict';

    var ui          = Nodium.ui,
        EdgeEvent   = Nodium.event.EdgeEvent,
        Event       = Nodium.event.Event,
        _defaults   = {};

    ui.EdgeModePanel = Nodium.createClass({

        construct: function (options, selector) {

            this.options = $.extend({}, _defaults, options);
            this.name = 'Edge mode';
            this.selector = selector;

            $(selector).on(Event.CHANGE, 'input[type=radio]', this.handleChange.bind(this));
            $('input[value=LINK]').click();
        },

        /**
         * set the edge mode variable
         */
        handleChange: function (event) {

            var target = event.target,
                mode = $(target).val();

            $(target)
                .parent()
                .addClass('selected')
                .siblings()
                .removeClass('selected');

            $(this.kernel).trigger(EdgeEvent.MODECHANGE, [mode]);
        }
    });
};
