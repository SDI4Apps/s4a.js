/* global s4a */

/**
 * <p>This is an abstract top-level object that take care of layout for a group
 * of elements</p>
 *
 * @constructor
 * @param {DOMElement} targetElement
 */
s4a.viz.layout.Anchor = function(targetElement) {

    var _self = this;

    if (targetElement.getDomElement) {
        targetElement = targetElement.getDomElement();
    }

    // Internal list of all vizualization objects added to the layout
    // key = position
    // value = list of vizualization objects at the given position
    var vizObjects = {};

    var nsVizDiv = 's4a-anchor';

    /**
     * Add a vizualiation object to the layout
     *
     * @param {s4a.viz.VizObj} vizObject
     * @param {string} position
     */
    _self.add = function(vizObject, position) {
        if (position && position.toLowerCase) {
            position = position.toLowerCase();
        }

        if (!vizObjects.hasOwnProperty(position)) {
            vizObjects[position] = [];
        }

        appendSvg(vizObject.getSvg(), position);
        vizObjects[position].push(vizObject);
    };

    /**
     * Append an svg element to the current layout
     *
     * @param {d3.svg} svg
     * @param {string} position
     * @private
     */
    var appendSvg = function(svg, position) {
        var mapdiv = d3.select('div.ol-viewport');

        // append to a  div based on their position
        var div = mapdiv.select('div.' + nsVizDiv + '.s4a-' + position);
        if (div.empty()) {
            div = mapdiv.append('div')
                .classed(nsVizDiv, true)
                .classed('s4a-' + position, true);
        }

        // append expects a function as input
        div.append(function() {
            return svg.node();
        });
    };

    var updateAllVizObjects = function(fn) {
        jQuery.each(vizObjects, function(position, vizObjectsAtPosition) {
            vizObjectsAtPosition.forEach(function(vizObj, idx) {
                fn(vizObj, position, vizObjectsAtPosition.length, idx);
            });
        });
    };

    /**
     * Overriden function from parent
     * Placing objects are handled through css
     */
    _self.redraw = function() {

    };

    return _self;
};
