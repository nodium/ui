module.exports = function (Nodium) {

    var mercury = require('mercury');

    'use strict';

    Nodium.renderComponent = function (domElement, Component, options) {

        mercury.app(
            domElement,
            Component(options),
            Component.render
        );
    };
};