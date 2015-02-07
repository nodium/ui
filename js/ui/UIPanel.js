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
module.exports = function (Nodium, undefined) {

'use strict';

    var ui          = Nodium.ui;

    ui.UIPanel = Nodium.createClass(ui.UIElement, {

        destroy: function () {
            this.view.remove();
        },

        hide: function () {

            this.isVisible = false;
            this.view.removeClass('active');
        },

        show: function () {
            this.isVisible = true;
            this.view.addClass('active');
        },

        super: Nodium.util.super,

        /**
         * Event handlers
         */
        handleMenuCollapse: function (event) {

            if (this.isVisible) {
                this.hide();
            }
        }
    });
};
