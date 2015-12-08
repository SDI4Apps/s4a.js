/**
 * Query helper object
 *
 * @class
 */
s4a.ir.QueryHelper = function() {

    var _self = this;

    var _query = null;

    var _wktPoint = null;

    var _buffer = null;

    /**
     * Set the query term
     *
     * @param {String} queryTerm
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
     */
    this.setDistance = function(wktPoint, buffer) {
        _wktPoint = wktPoint;
        _buffer = buffer;
        return _self;
    };

    this.addFacet = function(facet, term) {
        return _self;
    };

    this.filter = function(facet, value) {
        return _self;
    };

    this.query = function() {
        return {};
    };

};
