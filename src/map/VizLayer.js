/* global s4a */

/**
 * VizLayer
 *
 * @constructor
 */
s4a.map.VizLayer = function() {
    var _self = this;
    var isVisible = true;
    var nsVizDiv = 's4a-map';
    var vizObjects = [];

    /**
     * Add a vizualiation object to the layer
     *
     * @param {s4a.viz.VizObj} vizObject
     */
    _self.add = function(vizObject) {
        appendSvg(vizObject.getSvg());

        // Trigger repositioning when object has been resized
        $(vizObject).on('resize', _self.redraw);

        vizObjects.push(vizObject);
    };

    /**
     * Append an svg element to the current layout
     *
     * @param {d3.svg} svg
     * @private
     */
    var appendSvg = function(svg) {
        var mapdiv = d3.select('div.ol-viewport');
        var div = mapdiv.select('div.' + nsVizDiv);

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
     *
     * @return {boolean} The visibility of the layer.
     */
    _self.getVisible = function() {
        return isVisible;
    };

    /**
     * Get pixel coordinate
     *
     * @param {geometry} geometry position in EPSG:3857
     * @private
     */
    _self.getPosition = function(geometry) {
        return _self.map.projectPoint(
                geometry[0],
                geometry[1]
            );
    };

    /**
     * Reposition and redraw all vizObjects
     *
     */
    _self.redraw = function() {
        if (_self.map) {
            jQuery.each(vizObjects, function(i, vizObject) {
                var geometry = vizObject.getGeometry();
                var svg = vizObject.getSvg();

                if (geometry && svg) {
                    var origin;
                    var g = svg.selectAll('g');
                    var offset = svg.attr('width') / 2;
                    switch (geometry.type) {
                        case 'point':
                            origin = _self.getPosition(geometry.coordinates);
                            break;
                        default:
                            console.warn('s4a.map.VizLayer',
                                    'Unsupported geometry type',
                                    geometry.type);
                    }

                    if (!origin) {
                        return;
                    }

                    origin[0] -= offset;
                    origin[1] -= offset;

                    svg.style('left', origin[0] + 'px')
                        .style('top', origin[1] + 'px');
                }
            });
        }
    };

    _self.removeAt = function(index) {
        //cleanup
        $(vizObjects[index]).unbind('resize', _self.redraw);

        vizObjects = vizObjects.filter(function(value, i) {
            return i !== index;
        });
    };

    _self.removeObjects = function(vizObject) {
        //cleanup
        $(vizObject).unbind('resize', _self.redraw);

        vizObjects = vizObjects.filter(function(value) {
            return value !== vizObject;
        });
    };

    /**
     * Bind a map to the layer.
     *
     * @param {s4a.map.Map} map
     * @private
     */
    _self.setMap = function(map) {
        _self.map = map;
    };

    /**
     * Set the visibility of the layer (`true` or `false`).
     *
     * @param {boolean} visible The visibility of the layer.
     */
    _self.setVisible = function(visible) {
        isVisible = visible;

        vizObjects.forEach(function(vizObject) {
            vizObject.setVisible(visible);
        });
    };

    return _self;
};

