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
        EdgeEvent   = Nodium.event.EdgeEvent,
        NodeEvent   = Nodium.event.NodeEvent,
        model       = Nodium.model,
        Node        = model.Node,
        List        = ui.List,
        _defaults;

    ui.NodeEditPanel = Nodium.createClass(ui.UIPanel, {

        construct: function (selector, options, kernel) {

            this.initialize(selector, kernel);

            this.options = $.extend({}, _defaults, options);
            this.name = 'Node Editor';
            this.icon = 'icon-pencil';

            // TODO put list item empty data somewhere else?
            this.propertyList = new List('#node-fields', '#node-form', {
                new:    '#new-property', // new handle
                delete: '.delete-property', // delete handle
                empty:  { field: '', value: '', rows:  1 } // empty prototype data
            });

            this.labelList = new List('#node-labels', '#node-form', {
                new:    '#new-label', // new handle
                delete: '.delete-label', // delete handle
                empty:  { label: '' } // empty prototype    data
            });

            this.edgeList = new List('#node-edges', '#node-form', {
                delete: '.delete-edge'
            });

            // mapping of node fields to ui field id
            // generalize this with options
            this.explicits = {
                'node-title': 'name'
            };

            /*
             * Typeahead using bloodhound
             * Initialization is done when the graph is loaded
             * and reinitialization when a node is updated
             */
            // this.bloodhound = new Bloodhound({
            //     name: 'edges',
            //     local: this.getTypeaheadNodes.bind(this),
            //     datumTokenizer: function (node) {
            //         return Bloodhound.tokenizers.whitespace(
            //             Node.getPropertyValue(node, 'name')
            //         );
            //     },
            //     queryTokenizer: Bloodhound.tokenizers.whitespace
            // });

            // $('#new-edge').typeahead(null, {
            //     source:     this.bloodhound.ttAdapter(),
            //     displayKey: function (node) {
            //         return Node.getPropertyValue(node, 'name');
            //     }
            // });
        },

        init: function (container) {

            $(container).on('menu-collapse', this.handleMenuCollapse.bind(this));
            this.kernel
                .on(this, NodeEvent.SELECTED)
                .on(this, NodeEvent.UNSELECTED)
                .on(this, NodeEvent.UPDATED);

            $(this.kernel).on(NodeEvent.LOADED, this.handleGraphLoaded.bind(this));
            $(this.kernel).on(EdgeEvent.CREATED, this.handleEdgeCreated.bind(this));
            $(this.kernel).on(EdgeEvent.DESTROYED, this.handleEdgeDestroyed.bind(this));

            this
                .on(this, '#node-form', Event.FOCUS_OUT, 'textarea')
                .on(this, '#node-form', Event.FOCUS_OUT, 'input');

            this.view.find('#node-form').on('keydown', function (event) { event.keyCode === 13 && event.preventDefault() });
            this.view.find('#new-edge').on('click', handleCreateEdge.bind(this));

            $(this.labelList).on('list-delete', this.handleDeleteElement.bind(this, 'label'));
            $(this.propertyList).on('list-delete', this.handleDeleteElement.bind(this, 'property'));
            $(this.edgeList).on('list-delete', this.handleDeleteEdge.bind(this));
            $(this.edgeList).on('list-click', this.handleEdgeElementClicked.bind(this));
            // $('#new-edge').on('typeahead:selected', this.handleCreateEdge.bind(this));

            $('#delete-node-button', this.view).on(Event.CLICK, this.handleDeleteNodeButtonClick.bind(this));

            return this;
        },

        getTypeaheadNodes: function () {

            // filter all nodes
            if (this.nodes) {
                return this.nodes.filter(function (node) {
                    return Node.hasProperty(node, 'name');
                });
            } else {
                return [];
            }
        },

        keyEdgesByNode: function () {

            var sourceId,
                targetId,
                currentId = Node.getId(this.nodeData),
                otherId,
                edges = {};

            // delete the edge from the nodeEdges
            this.nodeEdges.forEach(function (edge, i) {

                sourceId = Node.getId(edge.source);
                targetId = Node.getId(edge.target);

                if (currentId == sourceId) {
                    direction = 'from';
                    otherId = targetId;
                } else if (currentId == targetId) {
                    direction = 'to';
                    otherId = sourceId;
                }

                if (!edges.hasOwnProperty(nodeId)) {
                    edges[nodeId] = [];
                }

                edges[nodeId].push({
                    direction: direction,
                    edge:      edge,
                    other:     otherId
                });
            }, this);
        },

        show: function () {

            var titleField = $('#node-title', this.view);

            this.super('show');

            // delay setting focus to titleField to prevent breaking the layout
            window.setTimeout(function () {
                titleField.focus();
            }, 200);
            $(this.kernel).trigger('mode-change', 'select');
        },

        unset: function (data, type) {

            var update = new model.Update();

            if (type === 'label') {
                // data is the value
                update.unsetLabel(data);
            } else if (type === 'property') {
                // data is the property name
                update.unsetProperty(data);
            }

            $(this.kernel).trigger(NodeEvent.UPDATE, [null, this.nodeData, update]);
        },

        /**
         * Create an object that can be given to the list renderer
         */
        parseLabel: function (value) {

            return {
                label: value
            };
        },

        /**
         * Create an object that can be given to the list renderer
         */
        parseProperty: function (value, key) {

            return {
                field: key,
                value: value,
                rows: 1
            };
        },

        parseEdge: function (edge) {

            if (!this.nodeData) {
                return;
            }

            var id = Node.getId(this.nodeData),
                otherId,
                name,
                source = edge.source,
                target = edge.target,
                from   = Node.getId(source) == id;

            if (from) {
                otherId = Node.getId(target);
                name = Node.getPropertyValue(target, 'name');
            } else {
                otherId = Node.getId(source);
                name = Node.getPropertyValue(source, 'name');
            }

            return {
                edgeId:    edge._id,
                nodeId:    otherId,
                name:      name || '',
                direction: from ? 'right' : 'left'
            };
        },

        /**
         * Gets the labels from the html fields
         */
        getLabels: function () {

            var data = this.labelList.get();

            return _.chain(data)
                .map(_.first) // every item has one element
                .pluck('value')
                .filter(function (value) {return value !== '';})
                .valueOf();
        },

        /**
         * Gets the properties from the html fields
         */
        getProperties: function () {

            var data = this.propertyList.get(),
                key,
                value,
                properties;

            // get properties from the explicit fields first
            properties = _.chain(this.explicits)
                .invert() // put property names as keys
                .mapValues(function (selector) { return $('#' + selector).val() })
                .pick(_.identity) // filter where value is empty
                .valueOf();

            // handle the regular property fields
            _.forEach(data, function (row) {
                key = row[0].value;
                value = row[1].value;
                if (key != '' && value != '') {
                    properties[key] = value;
                }
            });

            return properties;
        },

        updateLabels: function () {

            var update = new model.Update();
            update.setLabels(this.getLabels());

            $(this.kernel).trigger(NodeEvent.UPDATE, [null, this.nodeData, update]);
        },

        updateProperties: function () {

            var update = new model.Update();
            update.setProperties(this.getProperties());

            $(this.kernel).trigger(NodeEvent.UPDATE, [null, this.nodeData, update]);
        },

        setData: function (data) {

            var propertyData,
                labelData,
                edgeData;

            this.nodeData  = data || {};
            this.nodeEdges = Node.filterEdges(data, this.edges);

            // set the explicit fields first
            _.forOwn(this.explicits, function (property, selector) {
                var value = Node.getPropertyValue(data, property) || '';
                $('#'+selector, this.view).val(value);
            }, this);

            propertyData = _.map(data._properties, this.parseProperty)
                            .filter(function (element) {
                                return !_.contains(_.values(this.explicits), element.field);
                            }, this);
            labelData    = _.map(data._labels, this.parseLabel);
            edgeData     = _.map(this.nodeEdges, this.parseEdge, this);

            this.propertyList.set(propertyData);
            this.labelList.set(labelData);
            this.edgeList.set(edgeData);
        },

        unsetData: function (data) {

            // clear the values that are not in a list
            _.forOwn(this.explicits, function (property, selector) {
                $('#'+selector, this.view).val('');
            }, this);

            // clear typeahead in the undocumented typeahead way...
            // $('#new-edge').typeahead('val', '');
            // $('#new-edge').val('');

            this.propertyList.clear();
            this.labelList.clear();
            this.edgeList.clear();

            this.nodeData = null;
            this.nodeEdges = null;
        },


        /*
         * Event handlers
         */
        
        handleAutocompleteSelected: function (event, node) {

            if (!this.nodeData) {
                return;
            }

            // put stuff in edgelist
            this.selectedEdgePoint = node;
        },

        handleCreateEdge: function (event, node) {

            var edgeType,
                endpoint,
                endpointName,
                find;

            find = this.view.find.bind(this.view);

            if (!this.nodeData) {
                return;
            }

            edgeType = find('#new-edge-type').val();

            // put stuff in edgelist
            if (this.selectedEdgePoint) {
                endpoint = this.selectedEdgePoint
            } else {
                
                endpointName = find('#new-edge-target').val();

                if (!endpointName) {
                    return;
                }

                endpoint = this.nodes.find(function (node) {
                    return endpointName === Node.getPropertyValue('name');
                });

                if (!endpoint) {
                    return;
                }
            }

            $(this.kernel).trigger(EdgeEvent.CREATE, [this.nodeData, endpoint, edgeType]);

            $('#new-edge-target')
                .val('')
                .focus();

            // $('#new-edge').typeahead('val', '').focus();
        },

        handleDeleteEdge: function (event, data) {

            var sourceId,
                targetId,
                nodeId = Node.getId(this.nodeData),
                otherId = data[0].data.nodeid;

            // delete the edge from the nodeEdges
            this.nodeEdges.forEach(function (edge, i) {

                sourceId = Node.getId(edge.source);
                targetId = Node.getId(edge.target);

                if (nodeId == sourceId && otherId == targetId ||
                    nodeId == targetId && otherId == sourceId) {

                    this.nodeEdges.splice(i, 1);
                    $(this.kernel).trigger(EdgeEvent.DESTROY, [edge.source, edge.target]);
                }
            }, this);
        },

        handleDeleteElement: function (type, event, data) {

            var key = data[0].value;

            if (key) {
                this.unset(key, type);
            }
        },

        handleDeleteNodeButtonClick: function (event) {

            event.preventDefault();
            event.stopPropagation();

            $(this.kernel).trigger(NodeEvent.DESTROY, [null, this.nodeData]);
        },

        /**
         * Show the edge in the list
         */
        handleEdgeCreated: function (event, edge, source, target) {

            // TODO make nice check or remove event handlers
            if (!this.nodeData || (this.nodeData._id !== source._id && this.nodeData._id !== target._id)) {
                return;
            }

            this.edgeList.add(this.parseEdge({
                _id:    edge._id,
                source: source,
                target: target
            }));

            this.nodeEdges.push(edge);
        },

        /**
         * Show the edge in the list
         */
        handleEdgeDestroyed: function (event, edge) {

            var source = edge.source,
                target = edge.target,
                edgeData;

            this.nodeEdges = _.reject(this.nodeEdges, function (e) {
                return e.source._id === source._id && e.target._id === target._id;
            });

            // very nasty stuff here
            this.edgeList.clear();
            edgeData = _.map(this.nodeEdges, this.parseEdge, this);
            this.edgeList.set(edgeData);
        },

        handleEdgeElementClicked: function (event, element, item) {

            console.log('Node edit edge element clicked');
            console.log(element);
            console.log(item);

            /* doesn't work yet
            // TODO use actual Update class here
            var edges = this.keyEdgesByNode(),
                update = {};


            if (element.class === 'edge-direction') {
                if (element.value === '<--') {
                    update['direction'] = 'from';
                } else if (element.value === '-->') {
                    update['direction'] = 'to';
                }
            }

            $(this.kernel).trigger(EdgeEvent.UPDATE, [edge, update]);
            */
        },

        handleFocusout: function (event) {

            if (!this.nodeData) {
                return;
            }

            // check if we're updating property or label
            if ($(event.currentTarget).hasClass('node-label-value')) {
                var label = $(event.currentTarget).val();
                this.updateLabels(label);
            } else {
                this.updateProperties();
            }
        },

        /**
         * We have to know about the nodes in the graph for use in the typeahead
         */
        handleGraphLoaded: function (event, nodes, edges) {

            console.log('EDIT PANEL GRAPH LOADED');
            console.log(nodes);
            console.log(edges);

            this.nodes = nodes;
            this.edges = edges;
            // this.bloodhound.initialize();
        },

        handleNodeSelected: function (event, node, data) {

            this.setData(data);
            this.view.trigger('panel-show', [this]);
        },

        handleNodeUnselected: function (event, node, data) {

            this.unsetData();
            this.view.trigger('panel-hide', [this]);
        },

        handleNodeUpdated: function (event, node, data, update) {

            if (this.isVisible && this.nodeData.index === data.index) {
                this.setData(data);
            }
        }
    });
};

