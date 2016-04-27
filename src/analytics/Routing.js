
s4a.extend('analytics');

s4a.analytics.Routing = (function() {
    'use strict';

    /**
     * This module includes functions to perform network route calculations
     *
     * @exports s4a.analytics.Routing
     */
    var module = {};

    /**
     * URL for routing web service
     *
     * @type {String}
     * @private
     */
    var _wsFragment = '/routing';

    /**
     * Calculate the shortest path between two network nodes on a topological network
     *
     * @param {Number} from The ID of the from node
     * @param {Number} to The ID of the to node
     * @return {Promise} description
     * @public
     */
    module.getShortestRoute = function(from, to) {

        var params = {
            action: 'GetShortestPath',
            from: from,
            to: to
        };

        return s4a.doPost(_wsFragment, params);

    };

    /**
     * Get the nearest network node to the specifiec longitude/latitude coordinates
     * within an optional buffer distance
     *
     * @param {Number} lon Longitude (x) coordinate
     * @param {Number} lat Latitude (y) coordinate
     * @param {Number} radius A radius in meters to search for matching network nodes
     * @returns {Promise}
     * @public
     */
    module.getNearestNode = function(lon, lat, radius) {

        if (radius === undefined) {
            radius = 100;
        }

        var params = {
            action: 'GetNearestNode',
            lon: lon,
            lat: lat,
            radius: radius
        };

        return s4a.doPost(_wsFragment, params);

    };

    /**
     * Calulate the optimal route
     *
     * @param {Number[]} nodes - Array of via node IDs
     * @param {Number} start - ID of start node
     * @param {Number} finish - ID of end node
     * @return {Object.<DataResponse>} - Returns a route object
     */
    module.getOptimalRoute = function(nodes, start, finish) {

        var params = {
            action: 'GetOptimalRoute',
            nodeIds: nodes.concat([finish, start]),
            start: start,
            finish: finish
        };

        return s4a.doPost(_wsFragment, params);

    };

    /**
     * Calulate the optimal route
     *
     * @param {Number} fromNode - Identifier of start node
     * @param {Number} distance - Distance to traverse along network in
     * all directions from start node
     * @return {Object.<AreaResponse>} - Returns an area object
     */
    module.getReachableArea = function(fromNode, distance) {
        var params = {
            action: 'GetReachableArea',
            fromNode: fromNode,
            distance: distance
        };

        return s4a.doPost(_wsFragment, params);
    };

    return module;

}());
