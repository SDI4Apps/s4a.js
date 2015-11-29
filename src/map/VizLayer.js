/* global s4a */

/**
 * VizLayer
 * 
 * @constructor
 */
s4a.map.VizLayer = function() {
    var vizObjects = [],
        _self = this,
        isVisible = true,
        nsVizDiv = 's4a-map';

    /**
     * Add a vizualiation object to the layer
     * @param {s4a.viz.VizObj} key
     */
    _self.add = function(vizObject) {
        appendSvg(vizObject.getSvg());
        vizObjects.push(vizObject);
    };

    /**
     * Append an svg element to the current layout 
     * {d3.svg} dvg
     * @private
     */
    var appendSvg = function (svg) {
        var mapdiv = d3.select('div.ol-viewport'),
            div = mapdiv.select('div.' + nsVizDiv);

        // all vizObjects will be appended to the same div
        if (div.empty()) {
            div = mapdiv.append('div').classed(nsVizDiv, true);
        }

        // append expects a function as input
        div.append(function() {
            return svg.node();
        });

        // set fixed position
        svg.style('position', 'fixed');
    };

    /**
     * Return the visibility of the layer (`true` or `false`).
     * @return {boolean} The visibility of the layer.
     */
    _self.getVisible = function() {
        return isVisible;
    };

    /**
     * Set the visibility of the layer (`true` or `false`).
     * @param {boolean} visible The visibility of the layer.
     */
    _self.setVisible = function(visible) {
        isVisible = visible;

        vizObjects.forEach(function(vizObject) {
            vizObject.setVisible(visible);
        });
    };

    /**
     * Set the visibility of the layer (`true` or `false`).
     * @param {boolean} visible The visibility of the layer.
     * @private
     */
    _self.getPosition = function(geometry) {
        return _self.map.projectPoint(
                geometry.x,
                geometry.y
            );
    };

    _self.redraw = function() {
        if (_self.map) {
            jQuery.each(vizObjects, function(i, vizObject) {
                var geometry = vizObject.getGeometry(),
                    svg = vizObject.getSvg();

                //Calcuate size
                //TODO: SKIP?
                //vizObject.redraw();

                if (geometry && svg) {
                    var g = svg.selectAll('g'),
                        offset = svg.attr('width') / 2,
                        origin = _self.getPosition(geometry);

                    origin[0] -= offset;
                    origin[1] -= offset;

                    svg.style('left', origin[0] + 'px')
                        .style('top', origin[1] + 'px');
                }
            });
        }
    };

    _self.removeAt = function(index) {
        vizObjects = vizObjects.filter(function(value, i) {
            return i !== index;
        });
    };

    _self.removeObjects = function(vizObject) {
        vizObjects = vizObjects.filter(function(value) {
            return value !== vizObject;
        });
    };

    /**
     * Bind a map to the layer.
     * @param {s4a.map.Map} map
     * @private
     */
    _self.setMap = function(map) {
        _self.map = map;
    };

    return _self;
};

