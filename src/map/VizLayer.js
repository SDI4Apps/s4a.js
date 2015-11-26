/* global s4a */

/**
 * VizLayer
 * 
 * @constructor
 */
s4a.map.VizLayer = function() {
    var vizObjects = [],
        _self = {},
        isVisible = true;

    /**
     * Add a vizualiation object to the layer
     * @param {s4a.viz.VizObj} key
     */
    _self.add = function(vizObject) {
        vizObjects.push(vizObject);     
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
     */
    _self.getPosition = function(feature, featureWidth) {
        var center = _self.map.projectPoint(
                feature.location.x,
                feature.location.y
            ),
            featureWidthHalf = (featureWidth / 2);

        return [
            center[0] - featureWidthHalf,
            center[1] - featureWidthHalf
        ];
    };

    _self.redraw = function() {
        if (_self.map) {
            jQuery.each(vizObjects, function(i, vizObject) {
                if (vizObject.redraw) {
                    vizObject.redraw(
                        function (feature, featureWidth) {
                            return _self.getPosition(feature, featureWidth);
                        }
                    );
                }
                else {
                    console.debug('s4a.viz.layout.Anchor:', 'Object does not implement the redraw interface:', vizObject);
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
     */
    _self.setMap = function(map) {
        _self.map = map;
    };

    return _self;
};

