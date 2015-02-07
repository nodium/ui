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
 */
module.exports = function (Nodium, $, undefined){

    'use strict';

    var ui          = Nodium.ui,
        EventAware  = Nodium.event.EventAware;

    ui.UIElement = Nodium.createClass(EventAware, {

        initialize: function (selector, kernel) {   

            this.view   = $(selector);
            this.kernel = kernel;
        },

        resolveSelector: function (selector) {

            if (selector) {
                return this.view.find(selector);
            }
            
            return this.view;
        }
    });
};
