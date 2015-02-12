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

    // var ui          = Nodium.ui,
    //     util        = Nodium.util,
    //     _defaults   = {
    //         expanded: false
    //     };

    var ui      = Nodium.ui,
        dom     = require('mercury').h,
        value   = require('mercury').value;

    ui.PanelContainer = Nodium.createView({

        getInitialState: function () {
            return {
                expandedPanel: value(undefined),
                panels:        value([])
            }
        },

        render: function (state) {

            var currentPanel,
                cx;

            console.log(state);

            currentPanel = state.currentPanel;

            cx = Nodium.classSet({
                'panelContainer':           true,
                'panelContainer--floating': true,
                'panelContainer--right':    true,
                'menu':                     true,
                'is-expanded':              null != currentPanel,
                'is-collapsed':             null == currentPanel
            });

            return dom('div', {
                    className: cx
                },
                state.panels.map(function (Panel) {

                    var panelState = Panel({
                        isActive: Panel.title === state.expandedPanel
                    });

                    return Panel.render(panelState);
                })
            );
        },

    // ui.PanelContainer = Nodium.createClass({

        // construct: function (selector, options) {

        //     this.options = $.extend({}, _defaults, options);
        //     this.view = $(selector);
        //     this.panels = {};
        //     this.isExpanded = this.options.expanded;

        //     $(window).on('keydown', this.handleKeyDown.bind(this));

        //     $(this.view)
        //         .on('panel-show', '.panel', this.handlePanelShow.bind(this))
        //         .on('panel-hide', '.panel', this.handlePanelHide.bind(this));

        //     $('.panel-navigation', this.view)
        //         .on('click', 'button', this.handleMenuButtonClicked.bind(this));

        //     return this;
        // },

        // destroy: function () {

        // },

        // addPanel: function (panel) {

        //     this.createMenuItem(panel.icon);
        //     this.panels[panel.icon] = panel;

        //     panel.init(this);

        //     return this;
        // },

        // removePanel: function (panel) {
        //     var index = this.panels.indexOf(panel);

        //     if (index === -1) {
        //         throw new Error('Could not remove panel.');
        //         return;
        //     }

        //     this.panels.splice(index, 1);
        //     $('.panel-navigation .' + panel.icon, this.view).remove();

        //     panel.destroy();

        //     return this;
        // },

        // expand: function (icon) {
        //     // $(this).trigger('expand', []);
        //     this.visiblePanel = icon;
        //     this.panels[icon].show();

        //     if (!this.isExpanded) {
        //         this.view.addClass('expanded');
        //     }

        //     this.isExpanded = true;
        // },

        // collapse: function () {

        //     if (this.isExpanded) {
        //         this.view.removeClass('expanded');
        //         $(this).trigger('menu-collapse');
        //     }

        //     this.isExpanded = false;
        // },

        // createMenuItem: function (icon) {

        //     var menu = $('.panel-navigation', this.view),
        //         menuItem;

        //     menuItem = util.createFromPrototype(menu, {
        //         icon: icon
        //     });

        //     menu.append(menuItem);
        // },

        // /**
        //  * Event Handlers
        //  */

        // handleKeyDown: function (event) {

        //     if (event.keyCode === 27) {
        //         this.collapse();
        //     }
        // },

        // handleMenuButtonClicked: function (event) {

        //     this.expand(event.currentTarget.className);
        // },

        // handlePanelShow: function (event, panel) {

        //     if (!this.isExpanded) {
        //         this.expand(panel.icon);
        //         // this.panels[this.visiblePanel].hide();
        //     }

        //     // this.expand(panel.icon);
        // },

        // handlePanelHide: function (event, panel) {

        //     if (this.isExpanded) {
        //         this.collapse();
        //         // this.panels[this.visiblePanel].hide();
        //     }

        //     // this.expand(panel.icon);
        // }
    });
};