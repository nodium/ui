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

    var mercury = require('mercury');

    'use strict';

    Nodium.renderComponent = function (domElement, Component, initialState) {

        mercury.app(
            domElement,
            Component(initialState),
            Component.render
        );
    };
};
