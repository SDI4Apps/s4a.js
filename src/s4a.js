/**
 * <p>SDI4Apps client-side library for rapid application development based on the
 * SDI4Apps platform OpenAPI</p>
 * <p>Functions to draw statistical maps for use with OpenLayers based applications.</p>
 *
 * @requires d3.v3
 * @requires jQuery-1.10.2
 * @requires jQuery-xml2json
 * @requires jQuery-number-2.1.3
 * @requires topojson
 * @requires simple-statistics
 * @requires queue.v1
 * @requires topojson.v1
 * @namespace s4a
 */
var s4a = (function() {

    var mod = {};

    var _openApiUrl = 'http://portal.sdi4apps.eu/openapi';
    var _proxyUrl = null;

    /**
     * Version number of the s4a.js library
     *
     */
    mod.version = '1.0';

    /**
     * Map related classes and modules
     *
     * @namespace s4a.map
     */
    mod.map = {};

    /**
     * Mobile related classes and modules
     *
     * @namespace s4a.mobile
     */
    mod.mobile = {};

    /**
     * Information retrieval related classes and modules
     *
     * @namespace s4a.ir
     */
    mod.ir = {};

    /**
     * Advanced visualization related classes and modules
     *
     * @namespace s4a.viz
     */
    mod.viz = {};

    /**
     * Analytics related classes and modules
     *
     * @namespace s4a.viz
     */
    mod.analytics = {};

    /**
     * Get or set a proxy script that will be used to access the platform
     *
     * @param {String} proxyUrl URL of local proxy script for non-CORS access to platform
     * @return {String} URL of proxy script if set
     */
    mod.proxy = function(proxyUrl) {
        if (proxyUrl !== undefined) {
            _proxyUrl = proxyUrl;
        }
        return _proxyUrl;
    };

    /**
     * Get or set open API URL of current instance
     *
     * @param {String} openApiUrl URI for SDI4Apps platform instance
     * @return {String} URL of OpenAPI instance if set
     */
    mod.openAPI = function(openApiUrl) {
        if (openApiUrl !== undefined) {
            _openApiUrl = openApiUrl;
        }
        return _openApiUrl;
    };

    return mod;

}());
