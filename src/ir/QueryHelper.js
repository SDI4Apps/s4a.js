
s4a.extend('ir');

/**
 * Query helper object
 *
 * @class
 */
s4a.ir.QueryHelper = function() {
    'use strict';

    /**
     * A place holder for the current instance of the query helper
     *
     * @type s4a.ir.QueryHelper
     */
    var _self = this;

    /**
     * The user entered query term
     *
     * @type String
     */
    var _query = null;

    /**
     * A wkt point
     *
     * @type String
     */
    var _wktPoint = null;

    /**
     * An optional buffer distance
     *
     * @type buffer
     */
    var _buffer = null;

    /**
     * The number of results to be returned
     *
     * @type Number
     */
    var _maxResults = null;

    /**
     * The extent to be searched within
     *
     * @type extent
     */
    var _extent = null;

    /**
     * The Web Service fragment to append to the OpenAPI URL to access
     * this service
     *
     * @type String
     */
    var _wsFragment = '/search';

    /**
     * Clears any search parameters on the current query helper
     *
     * @returns {s4a.ir.QueryHelper}
     */
    this.clear = function() {
        _query = null;
        _extent = null;
        _maxResults = null;
        _buffer = null;
        _wktPoint = null;
        return _self;
    };

    /**
     * Set the query term
     *
     * @param {String} queryTerm
     * @returns {s4a.ir.QueryHelper}
     */
    this.setQuery = function(queryTerm) {
        _query = queryTerm;
        return _self;
    };

    /**
     * Set the spatial point and distance in which to search for results
     *
     * @param {String} wktPoint A WKT point string
     * @param {Number} buffer Distance in meters
     * @returns {s4a.ir.QueryHelper}
     */
    this.setDistance = function(wktPoint, buffer) {
        _wktPoint = wktPoint;
        _buffer = buffer;
        return _self;
    };

    /**
     * Set the maximum number of search results to be returned by the query
     *
     * @param {Number} maxResults
     * @returns {s4a.ir.QueryHelper}
     */
    this.setMaxResults = function(maxResults) {
        _maxResults = maxResults;
        return _self;
    };

    /**
     * Set the extent for which search results will be boosted
     *
     * @param {String} extent - A comma separate list of minx, miny, maxx, maxy values
     * @returns {s4a.ir.QueryHelper}
     */
    this.setExtent = function(extent) {
        _extent = extent;
        return _self;
    };

    this.addFacet = function(facet, term) {
        return _self;
    };

    this.filter = function(facet, value) {
        return _self;
    };

    /**
     * Executes the query with the available parameters and returns a jQuery Promise object
     *
     * @returns {Promise.<Object>}
     */
    this.query = function() {

        var params = {};

        if (_query === null) {
            return;
        } else {
            params.q = _query;
        }

        if (_maxResults !== null) {
            params.maxresults = _maxResults;
        }

        if (_extent !== null) {
            params.extent = _extent;
        }

        return s4a.doPost(_wsFragment, params);
    };

};
