/* global s4a */

'use strict';
s4a.extend('map');

/**
 * Extent object
 *
 * @class
 */
s4a.map.Extent = function() {

    /**
     * Internal object to hold extent values
     * @type Number[]
     */
    var _extent = {
        minx: null,
        miny: null,
        maxx: null,
        maxy: null
    };

    /**
     * Get OpenLayers extent
     *
     * @returns {Number[]}
     */
    this.getOlExtent = function() {
        return [_extent.minx, _extent.miny, _extent.maxx, _extent.maxy];
    };

    /**
     * Extend the extent to contain an x, y pair
     *
     * @param {Number} x
     * @param {Number} y
     */
    this.extendByXY = function(x, y) {
        if (_extent.minx === null || x < _extent.minx) {
            _extent.minx = x;
        }
        if (_extent.maxx === null || x > _extent.maxx) {
            _extent.maxx = x;
        }
        if (_extent.miny === null || y < _extent.miny) {
            _extent.miny = y;
        }
        if (_extent.maxy === null || y > _extent.maxy) {
            _extent.maxy = y;
        }
    };

    /**
     * Extend the extent to contain an ol.Coordinate
     *
     * @param {ol.Coordinate} coordinate
     */
    this.extendByCoordinate = function(coordinate) {
        return this.extendByXY(coordinate[0], coordinate[1]);
    };

    /**
     * @property {s4a.map.Extent} extent - An extent object
     */
    this.extent = _extent;

};
