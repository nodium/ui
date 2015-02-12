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
module.exports = function (Nodium) {

    'use strict';

    var _ = Nodium.context._;

    /**
     * Returns a string from all keys in classList for which the value is truthy
     * @param {Object} classList
     * @returns {String}
     */
    Nodium.classSet = function (classList) {

        return _
            .chain(classList)
            .omit(isFalsy)
            .keys()
            .reduce(joinString)
            .value();
    };

    /**
     * Checks whether value is falsy, resolving functions
     * @param {*} value
     */
    function isFalsy (value) {

        return !(('function' === typeof value) ? value() : value);
    }

    /**
     * Concatenates b to a separated by a space
     * @param {*) a
     * @param {*} b
     * @returns {String}
     */
    function joinString (a, b) {

        return a + ' ' + b;
    }
};