'use strict';

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

    /**
     * Default OpenAPI instance
     *
     * @type String
     */
    var _openApiUrl = 'http://portal.sdi4apps.eu/openapi';

    /**
     * Proxy script URL (optional)
     *
     * @type String
     */
    var _proxyUrl = null;

    /**
     * Version number of the s4a.js library
     *
     */
    mod.version = '1.0';

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
    mod.openApiUrl = function(openApiUrl) {
        if (openApiUrl !== undefined) {
            _openApiUrl = openApiUrl;
        }
        return _openApiUrl;
    };

    /**
     * Extend s4a with a namespace string and return the namespace object
     *
     * @param {String} namespaceString - A namespace string where namespaces are separated by dots '.'
     * @return {Object} - Namespace object
     */
    mod.extend = function(namespaceString) {

        var parts = namespaceString.split('.');

        var parent = s4a;

        var pl;

        var i;

        pl = parts.length;
        for (i = 0; i < pl; i++) {

            if (typeof parent[parts[i]] === 'undefined') {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }

        return parent;
    };

    /**
     * Generic, re-usable Ajax function to perform all calls to server
     *
     * @param {String} wsFragment - The name of the web service including the leading slash
     * @param {Object} params - An object of parameters to be passed to the web service
     * @returns {Promise.<Object>} - A jQuery Promise object
     */
    mod.doPost = function(wsFragment, params) {
        var wsUrl = s4a.openApiUrl() + wsFragment;
        return jQuery.post(wsUrl, params, null, 'json');
    };

    return mod;

}());
