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
module.exports = function (Nodium, $, undefined) {

    'use strict';

    // var ui          = Nodium.ui,
    //     util        = Nodium.util,
    //     _defaults   = {
    //         expanded: false
    //     };

    var ui      = Nodium.ui,
        mercury = require('mercury'),
        dom     = mercury.h,
        value   = mercury.value;

    ui.PanelContainer = Nodium.createView({

        getInitialState: function () {
            return {
                channels: {
                    expand: expand,
                    collapse: collapse
                },
                expandedPanel: value(''),
                panels:        value([])
            }
        },

        render: function (state) {

            return dom('aside', {
                    className: getClassSet(state),
                    'ev-keydown': mercury.sendKey(state.channels.collapse, 27) // escape
                },
                [
                    renderTabBar(state),
                    renderPanels(state)
                ]
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

        // /**
        //  * Event Handlers
        //  */

        // handleKeyDown: function (event) {

        //     if (event.keyCode === 27) {
        //         this.collapse();
        //     }
        // },
    });

    function expand (state, data) {

        state.expandedPanel.set(data.panelTitle);
    }

    function collapse (state) {

        state.expandedPanel.set('');
    }

    function getClassSet (state) {

        var isExpanded = state.expandedPanel.length;

        return Nodium.classSet({
            'panelContainer':           true,
            'panelContainer--floating': true,
            'panelContainer--right':    true,
            'menu':                     true,
            'is-expanded':              isExpanded,
            'is-collapsed':             !isExpanded
        });
    }

    function renderPanels (state) {

        return state.panels.map(function (Panel) {

            var panelState = Panel({
                isActive: Panel.title === state.expandedPanel
            });

            return Panel.render(panelState);
        });
    }

    function renderTabBar (state) {

        return dom('nav.navigation.tabBar.panelContainer-tabBar',

            state.panels.map(function (Panel) {

                return dom('button.button.button--transparent.menu-item.u-row', {
                        'ev-click': mercury.send(state.channels.expand, {
                            panelTitle: Panel.title
                        })
                    },
                    [
                        dom('i', { className: 'icon fa ' + Panel.icon })
                    ]
                )
            })
        );
    }
};
