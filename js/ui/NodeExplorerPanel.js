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
module.exports = function (Nodium, $, _, undefined) {

    'use strict';

    var ui          = Nodium.ui,
        Event       = Nodium.event.Event,
        NodeEvent   = Nodium.event.NodeEvent,
        _defaults   = {};

    ui.NodeExplorerPanel = Nodium.createClass(ui.UIPanel, {

        construct: function (selector, options, kernel) {

        	this.initialize(selector, kernel);
        	this.options = $.extend({}, _defaults, options);
            this.name = 'Graph Explorer';
            this.icon = 'icon-globe';
        },

        init: function (container) {

            $(container).on('menu-collapse', this.handleMenuCollapse.bind(this));

            return this;
        },

        show: function () {

            this.super('show');

            $(this.kernel).trigger('mode-change', 'explorer');
        }
    });
};