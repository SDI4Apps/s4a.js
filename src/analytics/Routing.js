/**
 * This module includes functions to perform network route calculations
 *
 * @namespace s4a.analytics.routing
 */
s4a.analytics.routing = (function() {

    var wsUri = s4a.openApiUrl() + 'pgrouting/Routing';

    /**
     * Calculate the shortest path between two network nodes on a topological network
     *
     * @param {Number} from The ID of the from node
     * @param {Number} to The ID of the to node
     * @return {Promise} description
     */
    this.getRoute = function(from, to) {

        var params = {
            action: 'GetShortestPath',
            from: from,
            to: to
        };

        return jQuery.post(wsUri, params, null, 'json');

    };

    /**
     * Get the nearest netwrok node to the specifiec longitude/latitude coordinates
     * within an optional buffer distance
     *
     * @param {Number} lon Longitude (x) coordinate
     * @param {Number} lat Latitude (y) coordinate
     * @param {Number} radius A radius in meters to search for matching network nodes
     * @returns {Promise}
     */
    this.getNode = function(lon, lat, radius) {

        if (radius === undefined) {
            radius = 100;
        }

        var params = {
            action: 'GetNearestNode',
            lon: lon,
            lat: lat,
            radius: radius
        };

        return jQuery.post(wsUri, params, null, 'json');

    };

    return this;

}());
