'use strict';

s4a.extend('map');

/**
 * Utility class with functions for coordinate transformations
 *
 * @static
 * @requires ol
 */
s4a.map.Transform = (function() {

    var Transform = {};

    /**
     * Private method to perform the actual transformation
     *
     * @param {Number} fromSrs - An SRS id from the EPSG namespace
     * @param {Number} toSrs - An SRS id from the EPSG namespace
     * @param {ol.Coordinate} coordinate - A JavaScritp array with an x, y pair
     * @returns {ol.Coordinate}
     * @private
     */
    var _transform = function(fromSrs, toSrs, coordinate) {
        return ol.proj.transform(coordinate, 'EPSG:' + fromSrs, 'EPSG:' + toSrs);
    };

    /**
     * Transform a coordinate between user specified coordinate systems
     *
     * @param {Number} fromSrs - An SRS id from the EPSG namespace
     * @param {Number} toSrs - An SRS id from the EPSG namespace
     * @param {ol.Coordinate} coordinate - A JavaScritp array with an x, y pair
     * @returns {ol.Coordinate}
     */
    Transform.fromTo = function(fromSrs, toSrs, coordinate) {
        return _transform(fromSrs, toSrs, coordinate);
    };

    /**
     * Transform a coordinate from EPSG:4326 to EPSG:3857
     *
     * @param {ol.Coordinate} coordinate - A JavaScript array with an x, y pair
     * @returns {ol.Coordinate} - A JavaScritp array with an x, y pair
     */
    Transform.to3857 = function(coordinate) {
        return _transform(4326, 3857, coordinate);
    };

    /**
     * Transform a coordinate from EPSG:3857 to EPSG:4326
     *
     * @param {ol.Coordinate} coordinate - A JavaScritp array with an x, y pair
     * @returns {ol.Coordinate} - A JavaScritp array with an x, y pair
     */
    Transform.to4326 = function(coordinate) {
        return _transform(3857, 4326, coordinate);
    };

    /**
     * Transforms an ol.Extent from EPSG:4326 to EPSG:3857
     *
     * @param {type} extent - A JavaScript array with four elements in the order
     * minx, miny, maxx, maxy
     * @returns {Number[]} - A JavaScript array with four elements in the order
     * minx, miny, maxx, maxy
     */
    Transform.extentTo3857 = function(extent) {
        var minXY = _transform(4326, 3857, [extent[0], extent[1]]);
        var maxXY = _transform(4326, 3857, [extent[2], extent[3]]);
        return [minXY[0], minXY[1], maxXY[0], maxXY[1]];
    };

    /**
     * Transforms an ol.Extent from EPSG:3857 to EPSG:4326
     *
     * @param {type} extent - A JavaScript array with four elements in the order
     * minx, miny, maxx, maxy
     * @returns {Number[]} - A JavaScript array with four elements in the order
     * minx, miny, maxx, maxy
     */
    Transform.extentTo4326 = function(extent) {
        var minXY = _transform(3857, 4326, [extent[0], extent[1]]);
        var maxXY = _transform(3857, 4326, [extent[2], extent[3]]);
        return [minXY[0], minXY[1], maxXY[0], maxXY[1]];
    };

    return Transform;

}());
