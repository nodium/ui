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

    var context = Nodium.context,
        jQuery  = context.jQuery,
        _       = context._;

    Nodium.ui   = Nodium.ui || {};

    require('./ui/UIElement')(Nodium);
    require('./ui/UIPanel')(Nodium, jQuery);
    require('./ui/PanelContainer')(Nodium, jQuery);
    require('./ui/List')(Nodium, jQuery);
    require('./ui/EdgeEditor')(Nodium, jQuery, _);
    require('./ui/EdgeModePanel')(Nodium, jQuery);
    require('./ui/NodeEditPanel')(Nodium, jQuery, _);
    require('./ui/NodeExplorerPanel')(Nodium, jQuery, _);
    require('./ui/NodeFilterPanel')(Nodium, jQuery, _);
};
