/*! s4a - v1.0.0 - 2017-04-03
* https://github.com/SDI4Apps/s4a.js
* Copyright (c) 2017 SDI4Apps Partnership; Licensed  */
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
     * Generic, re-usable Ajax function to perform all Http Post calls to server
     *
     * @param {String} wsFragment - The name of the web service including the leading slash
     * @param {Object} params - An object of parameters to be passed to the web service
     * @returns {Promise.<Object>} - A jQuery Promise object
     * @param {String} dataType - The expected response type
     */
    mod.doPost = function(wsFragment, params, dataType) {
        if (dataType === undefined) {
            dataType = 'json';
        }
        var wsUrl = s4a.openApiUrl() + wsFragment;
        return jQuery.post(wsUrl, params, null, dataType);
    };

    /**
     * Generic, re-usable Ajax function to perform all Http Get calls to server
     *
     * @param {String} wsFragment - The name of the web service including the leading slash
     * @param {Object} params - An object of parameters to be passed to the web service
     * @param {String} dataType - The expected response type
     * @returns {Promise.<Object>} - A jQuery Promise object
     */
    mod.doGet = function(wsFragment, params, dataType) {
        if (dataType === undefined) {
            dataType = 'json';
        }
        var wsUrl = s4a.openApiUrl() + wsFragment;
        return jQuery.get(wsUrl, params, null, dataType);
    };

    return mod;

}());

s4a.extend('config');

s4a.config = (function() {
    'use strict';

    /**
     * @exports s4a.config
     */
    var module = {};

    /**
     * Load configuration
     *
     * @param {Object} configObject - Override any defaults
     */
    module.loadConfig = function(configObject) {

        configObject = configObject || {};

        var defaultConfig = {
            center: {
                x: 6.45996,
                y: 49.92294,
                epsg: 'EPSG:4326',
                zoom: 4
            },
            baselayers: [
                new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open?',
                        params: {
                            LAYERS: 'norges_grunnkart',
                            VERSION: '1.1.1'
                        }
                    })
                })
            ],
            layers: []
        };

        return jQuery.extend(defaultConfig, configObject);
    };

    return module;

})();


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

'use strict';

s4a.extend('data');

/**
 * SensLog communication object
 * 
 * @class
 */
s4a.data.SensLog = (function() {
    /**
     * Class with methods to interact with SensLog
     *
     * @exports SensLog
     */
    var SensLog = {};

    /**
     * URI fragment relative to OpenAPI base for ControllerServlet
     *
     * @type String
     */
    var _controllerServletUriFragment = '/../SensLog/ControllerServlet';

    /**
     * URI fragment relative to OpenAPI base for FeederServlet
     *
     * @type String
     */
    var _feederUriFragment = '/../SensLog/FeederServlet';

    /**
     * URI fragment relative to OpenAPI base for DataService
     *
     * @type String
     */
    var _dataServiceUriFragment = '/../SensLog/DataService';

    /**
     * URI fragment relative to OpenAPI base for SensorService
     *
     * @type String
     */
    var _sensorServiceUriFragment = '/../SensLog/SensorService';

    /**
     * Formats a JavaScript date into a SensLog date string
     *
     * @param {Date} jsDate - A JavaScript date
     * @returns {String} - SensLog formatted date string YYYY-MM-DDThh:mm:ss
     */
    var _toSensLogDate = function(jsDate) {

        var year = jsDate.getFullYear();
        var month = (jsDate.getMonth() + 1).toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        var day = jsDate.getDate().toString();
        if (day.length === 1) {
            day = '0' + day;
        }
        var hours = jsDate.getHours().toString();
        if (hours.length === 1) {
            hours = '0' + hours;
        }

        var minutes = jsDate.getMinutes().toString();
        if (minutes.length === 1) {
            minutes = '0' + minutes;
        }
        var seconds = jsDate.getSeconds().toString();

        if (seconds.length === 1) {
            seconds = '0' + seconds;
        }

        return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
    };

    /**
     * Formats a JavaScript date into a SensLog date string
     *
     * @param {Date} jsDate - A JavaScript date
     * @returns {String} - SensLog formatted date string YYYY-MM-DDThh:mm:ss
     */
    SensLog.toSensLogDate = _toSensLogDate;

    /**
     * Convert a SensLog date string to a JavaScript date
     *
     * @param {String} sensLogDateString
     * @returns {Date} - JavaScript date object
     */
    var _toJsDate = function(sensLogDateString) {
        var dateAndTime = sensLogDateString.split(' ');
        var dateParts = dateAndTime[0].split('-');
        // TODO: Only supports positive time-zone
        var timeParts = dateAndTime[1].split('+');
        var hourMinuteSecond = timeParts[0].split(':');
        var date = new Date(+dateParts[0],
                (+dateParts[1] - 1),
                +dateParts[2],
                +hourMinuteSecond[0],
                +hourMinuteSecond[1],
                +hourMinuteSecond[2]);
        return date;
    };

    /**
     * Convert a SensLog date string to a JavaScript date
     *
     * @param {String} sensLogDateString
     * @returns {Date} - JavaScript date object
     */
    SensLog.toJsDate = _toJsDate;

    /**
     * Converts a JavaScript date to an ISO date string
     *
     * @param {Date} jsDate
     * @returns {String} - ISO date YYYY-MM-DD hh:mm:ss
     */
    var _toIsoDate = function(jsDate) {
        var year = jsDate.getFullYear();
        var month = (jsDate.getMonth() + 1).toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        var day = jsDate.getDate().toString();
        if (day.length === 1) {
            day = '0' + day;
        }
        var hours = jsDate.getHours().toString();
        if (hours.length === 1) {
            hours = '0' + hours;
        }

        var minutes = jsDate.getMinutes().toString();
        if (minutes.length === 1) {
            minutes = '0' + minutes;
        }
        var seconds = jsDate.getSeconds().toString();

        if (seconds.length === 1) {
            seconds = '0' + seconds;
        }

        // TODO: Supports only GMT+2
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    };

    /**
     * Converts a JavaScript date to an ISO date string
     *
     * @param {Date} jsDate
     * @returns {String} - ISO date YYYY-MM-DD hh:mm:ss
     */
    SensLog.toIsoDate = _toIsoDate;

    /**
     * Send an auth request
     *
     * @param {String} username
     * @param {String} password
     * @returns {Promise.<Object>}
     */
    SensLog.login = function(username, password) {
        return s4a.doPost(_controllerServletUriFragment, {
            username: username,
            password: password
        });
    };

    /**
     * Insert of sensor unit position
     *
     * @param {Number} lat
     * @param {Number} lon
     * @param {Number} unitId
     * @param {Date} date
     * @returns {Promise.<Object>}
     */
    SensLog.insertPosition = function(lat, lon, unitId, date) {

        return s4a.doGet(_feederUriFragment, {
            Operation: 'InsertPosition',
            lat: lat,
            lon: lon,
            unit_id: unitId,
            date: _toSensLogDate(date)
        }, 'text');

    };

    /**
     * Insert a sensor observation
     *
     * @param {Number} value
     * @param {Number} unitId
     * @param {Number} sensorId
     * @param {Date} date
     * @returns {Promise.<Object>}
     */
    SensLog.insertObservation = function(value, unitId, sensorId, date) {

        return s4a.doGet(_feederUriFragment, {
            Operation: 'InsertObservation',
            value: value,
            unit_id: unitId,
            sensor_id: sensorId,
            date: _toSensLogDate(date)
        }, 'text');

    };

    /**
     * Get last position for devices belonging to user
     *
     * @param {String} username
     * @returns {Promise.<Object>}
     */
    SensLog.getLastPositions = function(username) {
        return s4a.doGet(_dataServiceUriFragment, {
            Operation: 'GetLastPositions',
            user: username
        });
    };

    /**
     * Get last position for specific device belonging to user
     *
     * @param {Number} unitId
     * @param {String} username
     * @returns {Promise.<Object|null>}
     */
    SensLog.getLastPosition = function(unitId, username) {
        return SensLog.getLastPositions(username).then(function(res) {
            for (var i = 0; i < res.length; i++) {
                var pos = res[i];
                if (pos.unit_id === unitId) {
                    return pos;
                }
            }
            return null;
        });
    };

    /**
     * Get observations for a sensor
     *
     * @param {Number} unitId
     * @param {Number} sensorId
     * @param {String} username
     * @param {Date} [from=undefined] - Observation start time
     * @param {Date} [to=undefined] - Observation end-time
     * @returns {Promise.<Object>}
     */
    SensLog.getObservations = function(unitId, sensorId, username, from, to) {

        var params = {
            Operation: 'GetObservations',
            unit_id: unitId,
            sensor_id: sensorId,
            user: username
        };

        if (from !== undefined && to !== undefined) {
            params.from = _toIsoDate(from);
            params.to = _toIsoDate(to);
        }

        return s4a.doGet(_sensorServiceUriFragment, params);
    };

    /**
     * Get sensors for a device
     *
     * @param {Number} unitId - Id of sensor
     * @param {String} username - User name of user owning sensor
     * @returns {Promise.<Object>}
     */
    SensLog.getSensors = function(unitId, username) {

        return s4a.doGet(_sensorServiceUriFragment, {
            Operation: 'GetSensors',
            unit_id: unitId,
            user: username
        });
    };

    /**
     * Get last observation
     *
     * @param {Number} unitId
     * @param {Number} sensorId
     * @param {String} username
     * @returns {Promise.<Object|null>}
     */
    SensLog.getLastObservation = function(unitId, sensorId, username) {
        return SensLog.getSensors(unitId, username).then(function(res) {
            var tmpSensor = null;
            for (var i = 0; i < res.length; i++) {
                if (res[i].sensorId === sensorId) {
                    tmpSensor = res[i];
                    break;
                }
            }
            if (tmpSensor !== null) {
                var toDate = _toJsDate(tmpSensor.lastObservationTime);
                var fromDate = new Date(toDate.getTime());
                fromDate.setSeconds(fromDate.getSeconds() - 1);
                toDate.setSeconds(toDate.getSeconds() + 1);

                return SensLog.getObservations(unitId,
                        sensorId,
                        username,
                        fromDate,
                        toDate)
                        .then(function(res) {
                            return res[res.length - 1];
                        });
            } else {
                return null;
            }
        });
    };

    return SensLog;

}());


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

'use strict';

s4a.extend('map');
/**
 * Geometry type enumeration
 *
 * @enum {String}
 */
s4a.map.GeometryType = {
    point: 'point',
    line: 'line',
    polygon: 'polygon',
    none: 'none'
};

'use strict';

/**
 * Mixin interface that must be implemented by s4a map tools
 * @interface
 * @mixin
 */
s4a.map.ITool = {

    /**
     * Human readable name of tool
     * @type {String}
     */
    label: 'Button',

    /**
     * Type of tool
     * @type {s4a.map.ToolType}
     */
    toolType: null,

    /**
     *
     * Type of geometry supported by tool
     * @type {s4a.map.GeometryType}
     */
    geomType: s4a.map.GeometryType.none,

    /**
     * Icon that will be used for tool button
     * @type {String}
     */
    icon: 'button.png',

    /**
     * Function that will be executed when the map is clicked when the tool is active
     *
     * @param {Object} e Mouse click event
     */
    onClick: function(e) {
        console.log('Must be overridden by derived class');
        return;
    },
    /**
     * Function that will be executed when the map is double-clicked when the tool is active
     *
     * @param {Object} e Mouse click event
     */
    onDoubleClick: function(e) {
        console.log('Must be overridden by derived class');
        return;
    },
    /**
     * Function that is run when the tool is activated
     */
    onActivate: function() {
        console.log('Must be overridden by derived class');
        return;
    },
    /**
     * Function that is run when the tool is deactivated
     */
    onDeactivate: function() {
        console.log('Must be overridden by derived class');
        return;
    }

};

'use strict';

/**
 * A layer switcher control for OpenLayers 3
 *
 * @classdesc
 * This is the
 * @class
 * @constructor
 */
s4a.map.LayerSwitcher = function() {

    /**
     * @property {Number} [test=1] - description
     */
    this.test = 1;

};

'use strict';

/* global s4a */
s4a.extend('map');

/**
 * Create a map
 *
 * @classdesc
 * This class provides the mechanism
 *
 * @constructor
 * @param {DOMElement|String} nodeId The element or id of an element in
 * your page that will contain the map.
 * @param {s4a.config} cfg default map config
 */
s4a.map.Map = function(nodeId, cfg) {
    var _key;
    var _self = this;
    var vizLayers = [];

    cfg = cfg || s4a.config.loadConfig();

    var center = [cfg.center.x, cfg.center.y];
    var mercator = 'EPSG:3857';

    if (cfg.center.epsg !== mercator) {
        center = ol.proj.transform(center, cfg.center.epsg, mercator);
    }

    var olMap = new ol.Map({
        layers: [
            new ol.layer.Group({
                'title': 'Base layer',
                layers: cfg.baselayers
            }),
            new ol.layer.Group({
                title: 'Overlays',
                layers: cfg.layers
            })
        ],
        renderer: 'canvas',
        target: nodeId,
        view: new ol.View({
            center: center,
            zoom: cfg.center.zoom
        })
    });

    // update all added vizLayers  when user interacts with
    // the map (zoom/pan)
    olMap.on('postcompose', function(event) {
        _self.redraw();
    });

    _self.add = function(vizLayer) {
        vizLayer.setMap(_self);
        vizLayers.push(vizLayer);
    };

    /**
     * Add a unique identifier that describes the application scope
     *
     * @param {string} key
     */
    _self.addKey = function(key) {
        _key = key;
    };

    /**
     * Create a sd4 map layer
     *
     * @param {String} nameOfLayer Layer name must exist on server an be avilable
     * @param {Object} extraParams optional URL parameters
     * in the current application scope (@see s4a.map.addKey).
     */
    _self.createMapLayer = function(nameOfLayer, extraParams) {
        var params = {
            key: _key,
            LAYERS: nameOfLayer
        };

        return new ol.layer.Image({
            source: new ol.source.ImageWMS({
                //TODO: Update url to backend
                url: 'http://localhost/a_a3_mapserver/mapserv.ashx',
                params: $.extend(params, extraParams)
            })
        });
    };

    _self.getDomElement = function() {
        return $(olMap.getViewport());
    };

    _self.getOlMap = function() {
        return olMap;
    };

    /**
     * Transform coordinate from EPSG:4326 to EPSG:3857 and return
     * pixel coordinate at given position
     *
     * @param {number} x
     * @param {number} y
     */
    _self.projectPoint = function(x, y) {
        var point = ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857');
        return olMap.getPixelFromCoordinate(point);
    };

    _self.redraw = function() {
        jQuery.each(vizLayers, function(position, vizLayer) {
            vizLayer.redraw();
        });
    };

    _self.removeAt = function(index) {
        vizLayers = vizLayers.filter(function(value, i) {
            return i !== index;
        });
    };

    _self.removeObjects = function(vizLayer) {
        vizLayers = vizLayers.filter(function(value) {
            return value !== vizLayer;
        });
    };

    return _self;
};

'use strict';
/**
 * A helper class to quickly add maps to your HTML5 applications
 *
 * @class
 */
s4a.map.MapHelper = function(nodeSelector, config) {

    var _self = this;
    if (nodeSelector === undefined) {
        throw 'The parameter nodeSelector is mandatory';
    }

    // Default configuration
    var _config = {
        zoomLevel: 14,
        extent: [-179, -85, 179, 85],
        layers: [],
        center: {
            lon: 6.11,
            lat: 49.58
        },
        activeLayer: 0,
        tools: [],
        activeTool: 0,
        baseMaps: {
            MAPQUEST: new ol.layer.Tile({
                source: new ol.source.MapQuest({
                    layer: 'osm'
                })
            }),
            OFFLINE: new ol.layer.Vector({
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    projection: 'EPSG:3857',
                    url: '../../data/countries.json',
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 0, 0)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ff0000',
                            width: 1
                        }),
                    })
                })
            })
        }
    };
    if (config !== undefined) {
        jQuery.extend(_config, config);
    }

    var _map = new ol.Map({
        layers: [
            _config.baseMaps.MAPQUEST
        ],
        target: nodeSelector,
        view: new ol.View({
            center: ol.proj.transform([_config.center.lon,
                _config.center.lat],
                    'EPSG:4326',
                    'EPSG:3857'),
            zoom: _config.zoomLevel
        })
    });
    /**
     * Transform coordinates between EPSG:4326 and EPSG:3857 SRS
     *
     * @param {ol.Coordinate} coordinate - An array in the order x,y
     * @param {Boolean} [inverse=false] - If set to true will convert from EPSG:3857 to EPSG:4326
     * @returns {ol.Coordinate}
     */
    this.transform = function(coordinate, inverse) {
        var p = null;
        if (inverse === true) {
            p = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        } else {
            p = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
        }
        return p;
    };
    /**
     * Returns the extent of the current map view
     *
     * @returns {ol.Extent}
     */
    this.getExtent = function() {
        return _map.getView().calculateExtent(_map.getSize());
    };
    /**
     * Zooms the map to the largest scale capable of displaying the entire extent
     * and optionally limits the view to a maximum zoom level
     *
     * @param {ol.Extent} extent
     * @param {Number} [maxZoom=14] - A number between 0 and 22
     */
    this.zoomToExtent = function(extent, maxZoom) {

        maxZoom = maxZoom || 14;
        _map.getView().fit(extent, _map.getSize());
        if (_map.getView().getZoom() > maxZoom) {
            _map.getView().setZoom(maxZoom);
        }

    };
    /**
     * Add a tool to the map
     *
     * @param {s4a.map.ITool} tool An object implementing the ITool interface
     */
    this.addTool = function(tool) {
        return _self;
    }
    ;
    /**
     * Add data to the map
     *
     * @param {String} json Local or remote URL of JSON document
     */
    this.addData = function(json) {
        var vector = new ol.layer.Vector({
            source: new ol.source.GeoJSON({
                projection: 'EPSG:3857',
                url: 'data/countries.json'
            })
        });
        _map.addLayer(vector);
        return _self;
    };
    /**
     * Draw the map
     *
     * @returns {s4a.map.MapHelper}
     */
    this.draw = function() {

        return _self;
    };
    /**
     * Add an event handler to a double click
     *
     * @param {Function} clickHandler
     */
    this.listenDoubleClick = function(clickHandler) {
        this.getMap().on('dblclick', clickHandler);
        return _self;
    };
    /**
     * Add an event handler to single click
     *
     * @param {Function} clickHandler
     */
    this.listenSingleClick = function(clickHandler) {
        this.getMap().on('singleclick', clickHandler);
        return _self;
    };
    /**
     * Return an ol map object for the MapHelper class
     */
    this.getMap = function() {
        return _map;
    };
};

'use strict';

/**
 * Tool type enumeration
 *
 * @enum {String}
 */
s4a.map.ToolType = {
    BUTTON: 'button',
    TOOL: 'tool',
    INPUT: 'input'
};

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

'use strict';

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


/* global s4a, LocalFileSystem */

'use strict';

s4a.extend('mobile');

s4a.mobile.File = (function() {

    var File = {};

    /**
     * Get a file entry for a specific filename
     *
     * @function getFileEntry
     * @param {String} filename
     * @returns {Promise.<s4a.mobile.FileResponse>}
     * @name File#getFileEntry
     */
    File.getFileEntry = function(filename, directory) {

        var promise = jQuery.Deferred();

        if (window.cordova !== undefined && window.cordova.file !== undefined) {

            if (directory === undefined) {
                directory = window.cordova.file.dataDirectory;
            }

            window.resolveLocalFileSystemURL(directory, function(directoryEntry) {
                directoryEntry.getFile(filename, {create: true}, function(fileEntry) {
                    promise.resolve(s4a.mobile.FileResponse.createSuccess(fileEntry));
                }, function(directoryEntryError) {
                    promise.resolve(s4a.mobile.FileResponse.createError(directoryEntryError));
                });

            }, function(resolveFileSystemError) {
                promise.resolve(s4a.mobile.FileResponse.createError(resolveFileSystemError));
            });

        } else {
            promise.resolve(
                    s4a.mobile.FileResponse
                    .createError('Requires Cordova with "cordova-plugin-file".'));
        }

        return promise;
    };

    /**
     * Write JSON object to file using the cordova-plugin-file API
     *
     * @param {String} filename - Filename to write to
     * @param {String} contents - Text to write to file
     * @returns {Promise.<s4a.mobile.FileResponse>}
     * @memberof s4a.mobile.File
     */
    File.writeFile = function(filename, contents) {

        var promise = jQuery.Deferred();

        File.getFileEntry(filename).then(function(fileResponse) {
            if (fileResponse.isSuccess()) {
                fileResponse.data.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function() {

                        promise.resolve(s4a.mobile.FileResponse.createSuccess(contents));

                    };
                    fileWriter.onerror = function(e) {

                        promise.resolve(s4a.mobile.FileResponse
                            .createError('Error writing file: ' + e.toString()));

                    };
                    var blob = new Blob([JSON.stringify(contents, null, '\t')], {type: 'text/plain'});
                    fileWriter.write(blob);
                });

            } else {
                promise.resolve(s4a.mobile.FileResponse
                    .createError('Error getting file entry: ' + fileResponse.messages));
            }
        });

        return promise;
    };

    /**
     * Read the JSON contents from a file using the cordova-plugin-file API
     *
     * @param {String} filename - Name of file to read
     * @returns {Promise.<s4a.mobile.FileResponse>} - If success, data property will be file contents
     * @memberof s4a.mobile.File
     */
    File.readFile = function(filename) {

        var promise = jQuery.Deferred();

        File.getFileEntry(filename).then(function(fileResponse) {
            if (fileResponse.isSuccess()) {
                fileResponse.data.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        promise.resolve(s4a.mobile.FileResponse.createSuccess(JSON.parse(this.result)));
                    };
                    reader.readAsText(file);

                }, function(onErrorReadFile) {
                    promise.resolve(s4a.mobile.FileResponse.createError(onErrorReadFile));
                });
            } else {
                promise.resolve(s4a.mobile.FileResponse.createError(fileResponse.messages));
            }
        });

        return promise;
    };

    return File;

}());

/* global s4a, LocalFileSystem */

'use strict';

s4a.extend('mobile');

/**
 * Response object for file operations
 *
 * @param {Boolean} [status=true] - Status of the response true for success, false for error
 * @param {Object} [data] - An Object
 * @param {String} [message] - A message to attach to the response
 * @class - A response object that is passed back and forth between methods in the s4a.mobile.File module
 * @constructor - Create a new FileResponse instance
 */
s4a.mobile.FileResponse = function(status, data, message) {

    /**
     * @type {Boolean}
     * @private
     */
    this.status = undefined;

    if (status !== undefined && status !== null) {
        this.status = status;
    } else {
        status = true;
    }

    /**
     * @type {Object}
     * @private
     */
    this.data = undefined;

    if (data !== undefined && data !== null) {
        this.data = data;
    }

    /**
     * @type {String[]}
     * @private
     */
    this.messages = [];

    // Add initial message to messages array
    if (message !== undefined && message !== null) {
        this.messages.push(message);
    }

    /**
     * Checks if response is success
     *
     * @returns {Boolean} - True on success, false on error
     * @public
     */
    this.isSuccess = function() {
        return this.status === true ? true : false;
    };

    /**
     * Checks if response is error
     *
     * @returns {Boolean} - True on error, false on success
     * @public
     */
    this.isError = function() {
        return this.status === false ? true : false;
    };

    /**
     * Returns any messages in the response object
     *
     * @returns {String}
     * @public
     */
    this.getMessages = function() {
        var messages = '';
        for (var i = 0; i < this.messages.length; i++) {
            message += this.messages[i] + '\n';
        }
        return message;
    };

    /**
     * Overloads default toString, alias for getMessages()
     *
     * @returns {String}
     * @public
     */
    this.toString = function() {
        return this.getMessages();
    };

    /**
     * Add a message to the response
     *
     * @param {String} message
     * @public
     */
    this.addMessage = function(message) {
        this.messages.push(message);
    };

};

/**
 * Create an error FileResponse
 *
 * @param {String} message - An error message
 * @returns {s4a.mobile.FileResponse}
 * @memberof s4a.mobile.FileResponse
 * @static
 */
s4a.mobile.FileResponse.createError = function(message) {
    return new s4a.mobile.FileResponse(false, null, message);
};

/**
 * Create a success FileReponse
 *
 * @param {Object} data - A data object
 * @returns {s4a.mobile.FileResponse}
 * @memberof s4a.mobile.FileResponse
 * @static
 */
s4a.mobile.FileResponse.createSuccess = function(data) {
    return new s4a.mobile.FileResponse(true, data, null);
};

'use strict';

s4a.extend('mobile');

/**
 * Offline layer
 *
 * @class
 */
s4a.map.OfflineLayer = function() {

    /**
     * Dataset
     *
     * @type {GeoJSON}
     */
    this.dataset = null;

};

'use strict';
s4a.extend('mobile');

/**
 *
 *
 * @class
 */
s4a.mobile.OfflineTileLayer = function() {
    /**
     * URL of tile layer on device
     *
     * @type {String.<URL>}
     */
    this.onDeviceURL = null;

    /**
     * URL of basemap
     *
     * @type {String.<URL>}
     */
    this.baseMapURL = null;
};

/**
 * [create description]
 *
 * @param {String} baseMapId [description]
 * @param {String} extent [description]
 * @return {Object} [description]
 */
s4a.mobile.OfflineTileLayer.create = function(baseMapId, extent) {
    return {};

};

/**
 * [clearBaseMapCache description]
 *
 * @param {String} baseMapId [description]
 * @return {Object} [description]
 */
s4a.mobile.OfflineTileLayer.clearBaseMapCache = function(baseMapId) {

    return {};

};

'use strict';

s4a.extend('mobile');

s4a.mobile.FeatureSync = (function() {

    /**
     * [module description]
     * @exports s4a.mobile.FeatureSync
     */
    var module = {};

    /**
     * Check out a portion of a feature layer
     */
    module.CheckOut = function() {

    };

    /**
     * Check in an edited feature layer
     */
    module.CheckIn = function() {

    };

    /**
     * Get conflicts if any for a featyre layer
     */
    module.GetConflicts = function() {

    };

    /**
     * Resolve conflict
     */
    module.Resolve = function() {

    };

    return module;

}());

'use strict';
s4a.extend('viz');

/**
 * Object that defines the content, type and layout of a map
 *
 * @class
 * @constructor
 * @property {String} [title=null] The title of the chart
 * @property {String} [mapType="choroplethMap"] One of: "choroplethMap", "bubbleMap",
 *              "pieChartMap" or "bubbleChoroplethMap"
 * @property {String} mapUnitType The type of map unit (i.e. "land", "fylke", "kommune", "grunnkrets")
 * @property {Array} mapUnitIDs An array of map unit IDs. This array should be of the same length
 *              as the array seriesData.
 * @property {Array} seriesLabels An array of strings containing the name of each data series
 *              if the map contains more than one series. This array shoud be of the same length
 *              as the arrays stored in each item of the array seriesData
 * @property {Array} seriesData An array of arrays with one key for each mapUnitID in the array
 *              mapUnitIDs, each sub-array should have as many entries as the array seriesLabels
 * @property {Array} domains The classification of the data series, e.g. the array [1,3,5,7,9]
 *              represents the classes 1-3, 3-5, 5-7 and 7-9.
 * @property {Array} [colors=["Reds"]] An array of named color scales as defined in AASDiag.Colors.
 *              Legal values include "Blues", "Greens", "Oranges", "Reds"
 * @property {Boolean} [showLabels=false] True to show labels
 * @property {Array} [showSeries=[0]] An array containing the zero-based index of
 *              the series to display if the supplied data contains more than one
 *              data series. the mapType "bubbleChoroplethMap" supports
 *              two data series and the mapType "pieChartMap" supports any number of
 *              data series.
 * @property {Number} [mapWidth="auto"] The width of the map in pixels or auto to use
 *              width of containing DOM element
 * @property {Number} [mapHeight="auto"] The width of the map in pixels or auto to use
 *              height of containing DOM element
 */
s4a.viz.ChartConfig = function(mChartConfig) {
    mChartConfig = mChartConfig || {};
    var defaults = {
        title: null,
        description: null,
        intervals: [],
        mapType: 'choroplethMap',
        mapUnitType: null,
        mapUnitIDs: null,
        seriesLabels: null,
        seriesData: null,
        domains: null,
        colors: ['RdPu'],
        showLabels: false,
        showSeries: [0],
        mapWidth: 'auto',
        mapHeight: 'auto',
        fontSize: 12,
        collapsed: false,
        collapsedWidth: 75,
        collapsible: false,
        donutWidth: 75,
        radius: 150,
        scale: 1,
        width: 250,
        height: null,
        legendWidth: 100
    };
    return $.extend(defaults, mChartConfig);
};

'use strict';
/**
 * Color scales
 * This product includes color specifications and designs developed by
 * Cynthia Brewer (http://colorbrewer.org/). JavaScript specs as packaged
 * in the D3 library (d3js.org).
 * Please see license at http://colorbrewer.org/export/LICENSE.txt
 * @readonly
 * @enum {Object}
 */
s4a.viz.color = {
    /**
     * Yellow to green
     * @type Object
     */
    YlGn: {
        3: ['#f7fcb9', '#addd8e', '#31a354'],
        4: ['#ffffcc', '#c2e699', '#78c679', '#238443'],
        5: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
        6: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'],
        7: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32'],
        8: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32'],
        9: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837',
            '#004529']
    },
    /**
     * Yellow through Green to Blue
     * @type Object
     */
    YlGnBu: {
        3: ['#edf8b1', '#7fcdbb', '#2c7fb8'],
        4: ['#ffffcc', '#a1dab4', '#41b6c4', '#225ea8'],
        5: ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'],
        6: ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'],
        7: ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'],
        8: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'],
        9: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494',
            '#081d58']
    },
    /**
     * Green to blue
     * @type Object
     */
    GnBu: {
        3: ['#e0f3db', '#a8ddb5', '#43a2ca'],
        4: ['#f0f9e8', '#bae4bc', '#7bccc4', '#2b8cbe'],
        5: ['#f0f9e8', '#bae4bc', '#7bccc4', '#43a2ca', '#0868ac'],
        6: ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#43a2ca', '#0868ac'],
        7: ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#08589e'],
        8: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#08589e'],
        9: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac',
            '#084081']
    },
    /**
     * Blue to green
     * @type Object
     */
    BuGn: {
        3: ['#e5f5f9', '#99d8c9', '#2ca25f'],
        4: ['#edf8fb', '#b2e2e2', '#66c2a4', '#238b45'],
        5: ['#edf8fb', '#b2e2e2', '#66c2a4', '#2ca25f', '#006d2c'],
        6: ['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#2ca25f', '#006d2c'],
        7: ['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824'],
        8: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824'],
        9: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c',
            '#00441b']
    },
    /**
     * Purple through blue to green
     * @type Object
     */
    PuBuGn: {
        3: ['#ece2f0', '#a6bddb', '#1c9099'],
        4: ['#f6eff7', '#bdc9e1', '#67a9cf', '#02818a'],
        5: ['#f6eff7', '#bdc9e1', '#67a9cf', '#1c9099', '#016c59'],
        6: ['#f6eff7', '#d0d1e6', '#a6bddb', '#67a9cf', '#1c9099', '#016c59'],
        7: ['#f6eff7', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016450'],
        8: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016450'],
        9: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59',
            '#014636']
    },
    /**
     * Purple to blue
     * @type Object
     */
    PuBu: {
        3: ['#ece7f2', '#a6bddb', '#2b8cbe'],
        4: ['#f1eef6', '#bdc9e1', '#74a9cf', '#0570b0'],
        5: ['#f1eef6', '#bdc9e1', '#74a9cf', '#2b8cbe', '#045a8d'],
        6: ['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#2b8cbe', '#045a8d'],
        7: ['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b'],
        8: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b'],
        9: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d',
            '#023858']
    },
    /**
     * Blue to purple
     * @type Object
     */
    BuPu: {
        3: ['#e0ecf4', '#9ebcda', '#8856a7'],
        4: ['#edf8fb', '#b3cde3', '#8c96c6', '#88419d'],
        5: ['#edf8fb', '#b3cde3', '#8c96c6', '#8856a7', '#810f7c'],
        6: ['#edf8fb', '#bfd3e6', '#9ebcda', '#8c96c6', '#8856a7', '#810f7c'],
        7: ['#edf8fb', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#6e016b'],
        8: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#6e016b'],
        9: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c',
            '#4d004b']
    },
    /**
     * Red to purple
     * @type Object
     */
    RdPu: {
        3: ['#fde0dd', '#fa9fb5', '#c51b8a'],
        4: ['#feebe2', '#fbb4b9', '#f768a1', '#ae017e'],
        5: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'],
        6: ['#feebe2', '#fcc5c0', '#fa9fb5', '#f768a1', '#c51b8a', '#7a0177'],
        7: ['#feebe2', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'],
        8: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'],
        9: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177',
            '#49006a']
    }, PuRd: {
        3: ['#e7e1ef', '#c994c7', '#dd1c77'],
        4: ['#f1eef6', '#d7b5d8', '#df65b0', '#ce1256'],
        5: ['#f1eef6', '#d7b5d8', '#df65b0', '#dd1c77', '#980043'],
        6: ['#f1eef6', '#d4b9da', '#c994c7', '#df65b0', '#dd1c77', '#980043'],
        7: ['#f1eef6', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#91003f'],
        8: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#91003f'],
        9: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043',
            '#67001f']
    }, OrRd: {
        3: ['#fee8c8', '#fdbb84', '#e34a33'],
        4: ['#fef0d9', '#fdcc8a', '#fc8d59', '#d7301f'],
        5: ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'],
        6: ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000'],
        7: ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000'],
        8: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000'],
        9: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000',
            '#7f0000']
    }, YlOrRd: {
        3: ['#ffeda0', '#feb24c', '#f03b20'],
        4: ['#ffffb2', '#fecc5c', '#fd8d3c', '#e31a1c'],
        5: ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
        6: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'],
        7: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'],
        8: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'],
        9: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026',
            '#800026']
    }, YlOrBr: {
        3: ['#fff7bc', '#fec44f', '#d95f0e'],
        4: ['#ffffd4', '#fed98e', '#fe9929', '#cc4c02'],
        5: ['#ffffd4', '#fed98e', '#fe9929', '#d95f0e', '#993404'],
        6: ['#ffffd4', '#fee391', '#fec44f', '#fe9929', '#d95f0e', '#993404'],
        7: ['#ffffd4', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#8c2d04'],
        8: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#8c2d04'],
        9: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404',
            '#662506']
    }, Purples: {
        3: ['#efedf5', '#bcbddc', '#756bb1'],
        4: ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#6a51a3'],
        5: ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'],
        6: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'],
        7: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#4a1486'],
        8: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#4a1486'],
        9: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f',
            '#3f007d']
    }, Blues: {
        3: ['#deebf7', '#9ecae1', '#3182bd'],
        4: ['#eff3ff', '#bdd7e7', '#6baed6', '#2171b5'],
        5: ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'],
        6: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'],
        7: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
        8: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
        9: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c',
            '#08306b']
    }, Greens: {
        3: ['#e5f5e0', '#a1d99b', '#31a354'],
        4: ['#edf8e9', '#bae4b3', '#74c476', '#238b45'],
        5: ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'],
        6: ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'],
        7: ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#005a32'],
        8: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#005a32'],
        9: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c',
            '#00441b']
    }, Oranges: {
        3: ['#fee6ce', '#fdae6b', '#e6550d'],
        4: ['#feedde', '#fdbe85', '#fd8d3c', '#d94701'],
        5: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'],
        6: ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'],
        7: ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04'],
        8: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04'],
        9: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603',
            '#7f2704']
    }, Reds: {
        3: ['#fee0d2', '#fc9272', '#de2d26'],
        4: ['#fee5d9', '#fcae91', '#fb6a4a', '#cb181d'],
        5: ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'],
        6: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'],
        7: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
        8: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
        9: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15',
            '#67000d']
    }, Greys: {
        3: ['#f0f0f0', '#bdbdbd', '#636363'],
        4: ['#f7f7f7', '#cccccc', '#969696', '#525252'],
        5: ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'],
        6: ['#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#636363', '#252525'],
        7: ['#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525'],
        8: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525'],
        9: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525',
            '#000000']
    }, PuOr: {
        3: ['#f1a340', '#f7f7f7', '#998ec3'],
        4: ['#e66101', '#fdb863', '#b2abd2', '#5e3c99'],
        5: ['#e66101', '#fdb863', '#f7f7f7', '#b2abd2', '#5e3c99'],
        6: ['#b35806', '#f1a340', '#fee0b6', '#d8daeb', '#998ec3', '#542788'],
        7: ['#b35806', '#f1a340', '#fee0b6', '#f7f7f7', '#d8daeb', '#998ec3', '#542788'],
        8: ['#b35806', '#e08214', '#fdb863', '#fee0b6', '#d8daeb', '#b2abd2', '#8073ac', '#542788'],
        9: ['#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac',
            '#542788'],
        10: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#d8daeb', '#b2abd2', '#8073ac',
             '#542788', '#2d004b'],
        11: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2',
             '#8073ac', '#542788', '#2d004b']
    }, BrBG: {
        3: ['#d8b365', '#f5f5f5', '#5ab4ac'],
        4: ['#a6611a', '#dfc27d', '#80cdc1', '#018571'],
        5: ['#a6611a', '#dfc27d', '#f5f5f5', '#80cdc1', '#018571'],
        6: ['#8c510a', '#d8b365', '#f6e8c3', '#c7eae5', '#5ab4ac', '#01665e'],
        7: ['#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5', '#c7eae5', '#5ab4ac', '#01665e'],
        8: ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#c7eae5', '#80cdc1', '#35978f', '#01665e'],
        9: ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f',
            '#01665e'],
        10: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#c7eae5', '#80cdc1', '#35978f',
             '#01665e', '#003c30'],
        11: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1',
             '#35978f', '#01665e', '#003c30']
    }, PRGn: {
        3: ['#af8dc3', '#f7f7f7', '#7fbf7b'],
        4: ['#7b3294', '#c2a5cf', '#a6dba0', '#008837'],
        5: ['#7b3294', '#c2a5cf', '#f7f7f7', '#a6dba0', '#008837'],
        6: ['#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837'],
        7: ['#762a83', '#af8dc3', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#7fbf7b', '#1b7837'],
        8: ['#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837'],
        9: ['#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61',
            '#1b7837'],
        10: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#d9f0d3', '#a6dba0', '#5aae61',
             '#1b7837', '#00441b'],
        11: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0',
             '#5aae61', '#1b7837', '#00441b']
    }, PiYG: {
        3: ['#e9a3c9', '#f7f7f7', '#a1d76a'],
        4: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
        5: ['#d01c8b', '#f1b6da', '#f7f7f7', '#b8e186', '#4dac26'],
        6: ['#c51b7d', '#e9a3c9', '#fde0ef', '#e6f5d0', '#a1d76a', '#4d9221'],
        7: ['#c51b7d', '#e9a3c9', '#fde0ef', '#f7f7f7', '#e6f5d0', '#a1d76a', '#4d9221'],
        8: ['#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221'],
        9: ['#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41',
            '#4d9221'],
        10: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#e6f5d0', '#b8e186', '#7fbc41',
             '#4d9221', '#276419'],
        11: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186',
             '#7fbc41', '#4d9221', '#276419']
    }, RdBu: {
        3: ['#ef8a62', '#f7f7f7', '#67a9cf'],
        4: ['#ca0020', '#f4a582', '#92c5de', '#0571b0'],
        5: ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
        6: ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'],
        7: ['#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac'],
        8: ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'],
        9: ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3',
            '#2166ac'],
        10: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3',
             '#2166ac', '#053061'],
        11: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de',
             '#4393c3', '#2166ac', '#053061']
    }, RdGy: {
        3: ['#ef8a62', '#ffffff', '#999999'],
        4: ['#ca0020', '#f4a582', '#bababa', '#404040'],
        5: ['#ca0020', '#f4a582', '#ffffff', '#bababa', '#404040'],
        6: ['#b2182b', '#ef8a62', '#fddbc7', '#e0e0e0', '#999999', '#4d4d4d'],
        7: ['#b2182b', '#ef8a62', '#fddbc7', '#ffffff', '#e0e0e0', '#999999', '#4d4d4d'],
        8: ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#e0e0e0', '#bababa', '#878787', '#4d4d4d'],
        9: ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787',
            '#4d4d4d'],
        10: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#e0e0e0', '#bababa', '#878787',
             '#4d4d4d', '#1a1a1a'],
        11: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa',
             '#878787', '#4d4d4d', '#1a1a1a']
    }, RdYlBu: {
        3: ['#fc8d59', '#ffffbf', '#91bfdb'],
        4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
        5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
        6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
        7: ['#d73027', '#fc8d59', '#fee090', '#ffffbf', '#e0f3f8', '#91bfdb', '#4575b4'],
        8: ['#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'],
        9: ['#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1',
            '#4575b4'],
        10: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1',
             '#4575b4', '#313695'],
        11: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9',
             '#74add1', '#4575b4', '#313695']
    }, Spectral: {
        3: ['#fc8d59', '#ffffbf', '#99d594'],
        4: ['#d7191c', '#fdae61', '#abdda4', '#2b83ba'],
        5: ['#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba'],
        6: ['#d53e4f', '#fc8d59', '#fee08b', '#e6f598', '#99d594', '#3288bd'],
        7: ['#d53e4f', '#fc8d59', '#fee08b', '#ffffbf', '#e6f598', '#99d594', '#3288bd'],
        8: ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'],
        9: ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5',
            '#3288bd'],
        10: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5',
             '#3288bd', '#5e4fa2'],
        11: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4',
             '#66c2a5', '#3288bd', '#5e4fa2']
    }, RdYlGn: {
        3: ['#fc8d59', '#ffffbf', '#91cf60'],
        4: ['#d7191c', '#fdae61', '#a6d96a', '#1a9641'],
        5: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'],
        6: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'],
        7: ['#d73027', '#fc8d59', '#fee08b', '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'],
        8: ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'],
        9: ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63',
            '#1a9850'],
        10: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63',
             '#1a9850', '#006837'],
        11: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a',
             '#66bd63', '#1a9850', '#006837']
    }, Accent: {
        3: ['#7fc97f', '#beaed4', '#fdc086'],
        4: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99'],
        5: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0'],
        6: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f'],
        7: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17'],
        8: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666']
    }, Dark2: {
        3: ['#1b9e77', '#d95f02', '#7570b3'],
        4: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a'],
        5: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e'],
        6: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02'],
        7: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d'],
        8: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666']
    }, Paired: {
        3: ['#a6cee3', '#1f78b4', '#b2df8a'],
        4: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c'],
        5: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
        6: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c'],
        7: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f'],
        8: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00'],
        9: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00',
            '#cab2d6'],
        10: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00',
             '#cab2d6', '#6a3d9a'],
        11: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00',
             '#cab2d6', '#6a3d9a', '#ffff99'],
        12: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00',
             '#cab2d6', '#6a3d9a', '#ffff99', '#b15928']
    }, Pastel1: {
        3: ['#fbb4ae', '#b3cde3', '#ccebc5'],
        4: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4'],
        5: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6'],
        6: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc'],
        7: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd'],
        8: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec'],
        9: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec',
            '#f2f2f2']
    }, Pastel2: {
        3: ['#b3e2cd', '#fdcdac', '#cbd5e8'],
        4: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4'],
        5: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9'],
        6: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae'],
        7: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc'],
        8: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc']
    }, Set1: {
        3: ['#e41a1c', '#377eb8', '#4daf4a'],
        4: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3'],
        5: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
        6: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'],
        7: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'],
        8: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'],
        9: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf',
            '#999999']
    }, Set2: {
        3: ['#66c2a5', '#fc8d62', '#8da0cb'],
        4: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3'],
        5: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854'],
        6: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f'],
        7: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494'],
        8: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3']
    }, Set3: {
        3: ['#8dd3c7', '#ffffb3', '#bebada'],
        4: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072'],
        5: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
        6: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462'],
        7: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69'],
        8: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5'],
        9: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5',
            '#d9d9d9'],
        10: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5',
             '#d9d9d9', '#bc80bd'],
        11: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5',
             '#d9d9d9', '#bc80bd', '#ccebc5'],
        12: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5',
             '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']
    }};

'use strict';

'use strict';
/**
 * Legend for a visualization
 *
 * @param {s4a.viz.ChartConfig} chartConfig
 * @constructor
 */
s4a.viz.Legend = function(chartConfig) {

    /**
     * Internal reference to retain reference to self out of scope
     * @type s4a.viz.Legend
     */
    var _self = this;
    var _keyHeight = 12;
    var _keyWidth = 20;
    var _keySpacing = 10;
    var _offsetX = _keySpacing;
    var _offsetY = _keySpacing;
    var _availableWidth = chartConfig.legendWidth - ((3 * _keySpacing) + _keyWidth);

    /**
     * Internal reference to Legend svg element.
     * Use getSvg to retrieve it
     *
     * @private
     */
    var svg = d3.select(document.createElementNS(d3.ns.prefix.svg, 'svg'))
            .attr('width', chartConfig.legendWidth)
            .attr('height', chartConfig.legendWidth)
            .attr('style', 'border: 1px solid black');

    /**
     * Element to be used for measuring font widths'
     */
    var legendRuler = d3.select('body')
            .append('svg')
            .style('visibility', 'hidden')
            .style('white-space', 'nowrap')
            .style('position', 'absolute')
            .append('text')
            .attr('id', 's4a-legend-ruler')
            .style('font-family', 'sans-serif')
            .style('font-size', chartConfig.fontSize);

    /**
     * Get the SVG of the legend
     *
     * @returns {svg}
     */
    _self.getSvg = function() {
        return svg.node();
    };

    /**
     * Get the width of a text string in pixels
     *
     * @param {string} textToMeasure Text to measure
     * @returns {number} Width of text in pixels
     * @private
     */
    var getTextWidth = function(textToMeasure) {
        legendRuler.text(textToMeasure);
        //return $('#s4a-legend-ruler').width();
        return legendRuler.node().getComputedTextLength();
    };

    /**
     * Split a label into a minimum number of lines
     *
     * @param {number} numParts
     * @param {string} label
     * @returns {string[]} String array with one entry for each line of the split text
     * @private
     */
    var splitLabel = function(numParts, label) {
        var _chunk = Math.ceil(label.length / numParts);
        var _parts = [];
        var _ct = 0;
        for (var _start = 0, _end = _chunk; _end <= label.length; true) {
            while (_ct <= (numParts * 5) && label[_end] !== ' ' && label[_end] !== '-') {
                _end -= 1;
                _ct++;
            }
            console.log(_ct);
            _parts.push(label.substring(_start, _end).trim());
            _start = _end;
            _end = _start + _chunk;
            if (_end >= label.length) {
                _parts.push(label.substring(_start, _end).trim());
                break;
            }
        }

        return _parts;
    };

    /**
     * Get the y-height of the line
     *
     * @param {type} lineIndex
     * @param {type} _lineHeight
     * @returns {Number}
     * @private
     */
    var getDy = function(lineIndex, _lineHeight) {
        // Return dy only for 2nd line of legend text and onwards
        if (lineIndex === 0) {
            return 0;
        } else {
            return _lineHeight;
        }
    };

    /**
     * Draws or updates legend
     */
    _self.updateLegend = function() {
        // Loop through labels
        for (var _i = 0; _i < (chartConfig.domains.length - 1); _i++) {

            var _id = 'key' + _i;
            var _label = chartConfig.seriesLabels[_i] + ' ' +
                    chartConfig.domains[_i] +
                    '-' + chartConfig.domains[_i + 1];
            // Append legend key
            svg.append('rect')
                    .attr('x', _offsetX)
                    .attr('y', _offsetY)
                    .attr('width', _keyWidth)
                    .attr('height', _keyHeight)
                    .style('fill', chartConfig.colors[_i]) //to be fixed
                    .style('stroke-width', 1)
                    .style('stroke', '#000000');
            // Append legend label
            svg.append('text')
                    .attr('id', _id)
                    .attr('x', _offsetX + _keyWidth + _keySpacing)
                    .attr('y', _offsetY + chartConfig.fontSize - 1)
                    .attr('text-anchor', 'left')
                    .attr('font-family', 'sans-serif')
                    .attr('font-size', chartConfig.fontSize)
                    .text(_label);
            // Get a reference to the drawn legend label
            var _labelElement = svg.select('#' + _id);

            // Calculate width of label
            var _labelWidth = getTextWidth(_label);
            // If label is too long, split it into multiple lines
            if (_labelWidth > _availableWidth) {

                // Remove old text
                _labelElement.text(null);
                // Calculate reasonable line height (experimental)
                var _lineHeight = Math.ceil(chartConfig.fontSize * 1.15);
                // Calculate tentative number of lines
                var _numParts = Math.ceil(_labelWidth / _availableWidth);
                // Get an array of lines by calling spitLabel function
                var _lines = splitLabel(_numParts, _label);
                // Loop through lines and add to text element as tspan elements
                for (var _l = 0; _l < _lines.length; _l++) {
                    _labelElement.append('tspan')
                            .attr('x', _offsetX + _keyWidth + _keySpacing)
                            .attr('dy', getDy(_l, _lineHeight))
                            .text(_lines[_l]);
                    // For each line of the legend, increment
                    _offsetY += chartConfig.fontSize;
                }

                // Increment vertical offset
                _offsetY += _lineHeight;
            } else {
                // Increment vertical offset
                _offsetY += _keySpacing + _keyHeight;
            }
        }

        // Resize SVG height
        svg.attr('height', _offsetY);
    };

    return _self;
};

'use strict';
/**
 * Enumeration of size-scales
 * @readonly
 * @enum {number}
 */
s4a.viz.Sizes = {
    /**
     * From 5px to 19px
     * @type Array
     */
    'small': ['5', '7', '9', '11', '13', '15', '17', '19'],
    /**
     * From 10px to 50px
     * @type Array
     */
    'medium': ['10', '15', '25', '30', '35', '40', '45', '50'],
    /**
     * From 10px to 80px
     * @type Array
     */
    'large': ['10', '20', '30', '40', '50', '60', '70', '80']
};

/**
 * Enumeration for font sizes
 * @readonly
 * @enum {number}
 */
s4a.viz.FontSizes = {
    /**
     * Small font size
     * @type Number
     */
    'small': 10,
    /**
     * The default font size
     * @type Number
     */
    'normal': 12,
    /**
     * A bigger font-size
     * @type Number
     */
    'medium': 14,
    /**
     * Large font-size
     * @type Number
     */
    'large': 18
};

'use strict';
/* global s4a */

/**
 * A top level object that coordinates data and visualizations
 *
 * @param {Object} pData
 * @constructor
 * @returns {s4a.viz.ViewCoordinator}
 */
s4a.viz.ViewCoordinator = function(pData) {

    var _data = pData;
    var _listeners = [];
    var _self = {};

    /**
     * Subscribes an object to publish events from the ViewCoordinator
     *
     * @returns {s4a.viz.ViewCoordinator}
     */
    _self.publish = function() {
        for (var i = 0; i < _listeners.length; i++) {
            var listener = _listeners[i];
            if (listener.update) {
                listener.update(_data);
                console.info('Published ' + i);
            } else {
                console.debug('Subscribed object ' + i + ' does not implement the update interface',
                    listener);
            }
        }
        return _self;
    };

    /**
     * Update the data object
     *
     * @param {Object} pData
     * @returns {s4a.viz.ViewCoordinator}
     */
    _self.setData = function(pData) {
        _data = pData;
        _self.publish();
        return _self;
    };

    /**
     * Subscribe an object to the ViewCoordinator
     *
     * @param {Object} pObj
     * @returns {s4a.viz.ViewCoordinator}
     */
    _self.subscribe = function(pObj) {
        if (_listeners.indexOf(pObj) < 0) {
            _listeners.push(pObj);
        }
        return _self;
    };

    /**
     * Unsubscribe an object from the ViewCoordinator
     *
     * @param {Object} pObj
     * @returns {s4a.viz.ViewCoordinator}
     */
    _self.unsubscribe = function(pObj) {
        var _modListeners = [];
        for (var i = 0; i < _listeners.length; i++) {
            if (_listeners[i] !== pObj) {
                _modListeners.push(_listeners[i]);
            }
        }
        _listeners = _modListeners;
        return _self;
    };

    _self.applyFilter = function() {
        _self.publish();
        return _self;
    };

    return _self;

};

'use strict';
/* global s4a */

/**
 * <p>This is an abstract top-level object that coordinates data and visualizations
 * that take part in a coordinated view</p>
 *
 * <p>Any visualization object must implement an interface that contains the methods
 * update and filter</p>
 *
 * <p>The object receives as part of the constructor a ViewCoordinator object
 * that implicitly contains data</p>
 *
 * <p>The object receives as part of the constructor a DOMElement identified by its
 * ID, typically i DIV in which it is to be drawn</p>
 *
 * @abstract
 * @constructor
 * @param {s4a.viz.ViewCoordinator} viewCoordinator
 * @param {DOMElement} domElement
 * @returns {s4a.viz.VizObj}
 */
s4a.viz.VizObj = function(viewCoordinator, domElement) {
    var _self = this;

    viewCoordinator.subscribe(_self);

    /**
     * Update the visualization
     *
     * @abstract
     */
    _self.update = function() {
        throw new Error('Must be implemented by sub-class');
    };

    /**
     * Apply a filter to the visualization
     *
     * @abstract
     */
    _self.filter = function(filter) {
        throw new Error('Must be implemented by sub-class');
    };

    _self.get = function() {
        throw new Error('Must be implemented by sub-class');
    };
};

'use strict';
/* global s4a */

/**
 * Enumeration
 *
 * @enum {number}
 * @readonly
 */
s4a.viz.VizType = {
    /**
     * Chart
     */
    CHART: 1,

    /**
     * Map
     */
    MAP: 2
};

'use strict';
s4a.extend('viz.chart');

/**
 * Create a new Bar chart object
 *
 * @class
 * @classdesc
 * Bar chart object
 */
s4a.viz.chart.Bar = function() {

};

'use strict';
/**
 * Create a new bubble chart object
 *
 * @class
 * @classdesc
 * Stacked bubble chart object
 */
s4a.viz.chart.Bubble = function() {

};

'use strict';
/**
 * Create a new row chart object
 *
 * @class
 * @classdesc
 * Row chart object
 */
s4a.viz.chart.Row = function() {

};

'use strict';
s4a.extend('viz.chart');

/**
 * Create a new line chart object
 *
 * @class
 * @classdesc
 * Bar line chart object
 */
s4a.viz.chart.Line = function() {

};

'use strict';
/**
 * Pie visualization
 *
 * @param {s4a.viz.ViewCoordinator} viewCoordinator
 * @param {s4a.viz.ChartConfig} mChartConfig
 * @constructor
 */
s4a.viz.Pie = function(viewCoordinator, mChartConfig) {
    var chartData, currentData, currentScale, scale, arc, bigArc;
    var _self = this;
    var transitionTime = 400;

    /**
     * Internal reference to Pie svg element.
     * Use getSvg to retrieve it
     *
     * @private
     */
    var svg = d3.select(document.createElementNS(d3.ns.prefix.svg, 'svg'));

    function changeCollapsedState(collapsed) {
        currentScale = collapsed ? scale : 1;

        var featureWidth = mChartConfig.width * currentScale;
        var featureHeight = mChartConfig.height * currentScale;
        var g = svg.selectAll('g');

        if (currentScale === 1) {
            svg.attr('width', featureWidth)
                .attr('height',featureHeight);

            $(_self).trigger('resize');

            g.attr('transform', 'translate(' + featureWidth / 2 + ',' + featureHeight / 2 + ')');

            svg.selectAll('path')
                .transition()
                .duration(transitionTime)
                .attr('d', currentScale === 1 ? bigArc : arc);
        } else {
            svg.selectAll('path')
                .transition()
                .duration(transitionTime)
                .attr('d', currentScale === 1 ? bigArc : arc);

            setTimeout(function() {
                svg.attr('width', featureWidth)
                    .attr('height',featureHeight);

                $(_self).trigger('resize');

                g.attr('transform', 'translate(' + featureWidth / 2 + ',' + featureHeight / 2 + ')');

            }, transitionTime);

        }
    }

    /**
     * Create new pie chart
     *
     * @param {integer} width optional width of svg
     * @param {integer} height optional height of svg
     * @private
     */
    function updateChart(width, height) {
        // pick the first series
        currentData = chartData.series[0].values;

        // and the first color
        var colors = s4a.viz.color[mChartConfig.colors[0]][currentData.length];

        mChartConfig.height = mChartConfig.height || mChartConfig.width;
        mChartConfig.collapsedHeight = mChartConfig.collapsedHeight || mChartConfig.collapsedWidth;

        scale = mChartConfig.collapsed ? mChartConfig.collapsedWidth / mChartConfig.width : 1;

        currentScale = scale;

        var radius = Math.min(mChartConfig.width, mChartConfig.height) / 2;
        var collapsedRadius = Math.min(mChartConfig.collapsedWidth, mChartConfig.collapsedHeight) / 2;

        var color = d3.scale.ordinal()
            .range(colors);

        arc = d3.svg.arc()
            .outerRadius(collapsedRadius);

        bigArc = d3.svg.arc()
            .outerRadius(radius);

        if (mChartConfig.innerWidth) {
            bigArc.innerRadius(radius - mChartConfig.innerWidth);
        }

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
                return d.valx;
            });

        // delete all current objects
        if (svg) {
            svg.selectAll('*').remove();
        }

        var g = svg.selectAll('.arc')
            .data(pie(currentData))
            .enter()
            .append('g')
            .attr('class', 'arc');

        // avoid flash
        g.attr('transform', 'translate(' + -4000 + ',' + -4000 + ')');

        g.append('path')
            .attr('d', mChartConfig.collapsed ? arc : bigArc)
            .style('fill', function(d) {
                return color(d.data.label);
            });

        if (mChartConfig.collapsed) {
            changeCollapsedState(true);
        }

        if (mChartConfig.collapsible) {
            g.on('click', function() {
                changeCollapsedState(currentScale === 1);
            });
        }
    }

    /**
     * Get the geometry bound to the vizObject
     *
     * @returns {Object} set of lonlat or null
     */
    _self.getGeometry = function() {
        return chartData.geometry;
    };

    /**
     * Get the svg representation of the vizObject
     *
     * @returns {d3.svg} set of lonlat or null
     */
    _self.getSvg = function() {
        return svg;
    };

    /**
     * Set the visibility of the pie visualization (`true` or `false`).
     *
     * @param {boolean} visible The visibility of the layer.
     */
    _self.setVisible = function(visible) {
        if (svg) {
            svg.attr('display', visible ? null : 'none');
        }
    };

    /**
     * Redraw the vizObject
     */
    _self.redraw = function() {
        var g = svg.selectAll('g');
        var featureWidth = mChartConfig.width * currentScale;
        var featureHeight = mChartConfig.height * currentScale;

        svg.attr('width', featureWidth)
            .attr('height', featureHeight);

        g.attr('transform', 'translate(' + featureWidth / 2 + ',' + featureHeight / 2 + ')');
    };

    // Methods inherited from top level vizObj

    /**
     * Callback from ViewCoordinator.
     * Update data object for the visualization
     *
     * @param {Object} mChartData
     */
    _self.update = function(mChartData) {
        chartData = mChartData;
        updateChart();
        _self.redraw();
    };

    /**
     * Apply a filter to the visualization
     *
     * @abstract
     */
    _self.filter = function() {
        throw new Error('Must be implemented by sub-class');
    };

    _self.get = function() {
        throw new Error('Must be implemented by sub-class');
    };

    viewCoordinator.subscribe(_self);

    return _self;
};

'use strict';
/**
 * Create a new Row chart object
 *
 * @class
 * @classdesc
 * Row chart object
 */
s4a.viz.chart.Row = function() {

};

'use strict';
/**
 * Create a new Scatter chart object
 *
 * @class
 * @classdesc
 * Scatter chart object
 */
s4a.viz.chart.Scatter = function() {

};

'use strict';
s4a.extend('viz.chart');

/**
 * Create a new stacked line chart object
 *
 * @class
 * @classdesc
 * Stacked line chart object
 */
s4a.viz.chart.StackedLine = function() {

};

'use strict';
/**
 * Create a new stacked row chart object
 *
 * @class
 * @classdesc
 * Stacked row chart object
 */
s4a.viz.chart.StackedRow = function() {

};

'use strict';
/* global s4a */
s4a.viz.layout = s4a.viz.layout || {};
/**
 * <p>This is an abstract top-level object that take care of layout for a group
 * of elements</p>
 *
 * @constructor
 * @param {DOMElement} targetElement
 */
s4a.viz.layout.Anchor = function(targetElement) {

    var _self = this;

    if (targetElement.getDomElement) {
        targetElement = targetElement.getDomElement();
    }

    // Internal list of all vizualization objects added to the layout
    // key = position
    // value = list of vizualization objects at the given position
    var vizObjects = {};

    var nsVizDiv = 's4a-anchor';

    /**
     * Add a vizualiation object to the layout
     *
     * @param {s4a.viz.VizObj} vizObject
     * @param {string} position
     */
    _self.add = function(vizObject, position) {
        if (position && position.toLowerCase) {
            position = position.toLowerCase();
        }

        if (!vizObjects.hasOwnProperty(position)) {
            vizObjects[position] = [];
        }

        appendSvg(vizObject.getSvg(), position);
        vizObjects[position].push(vizObject);
    };

    /**
     * Append an svg element to the current layout
     *
     * @param {d3.svg} svg
     * @param {string} position
     * @private
     */
    var appendSvg = function(svg, position) {
        var mapdiv = d3.select('div.ol-viewport');

        // append to a  div based on their position
        var div = mapdiv.select('div.' + nsVizDiv + '.s4a-' + position);
        if (div.empty()) {
            div = mapdiv.append('div')
                .classed(nsVizDiv, true)
                .classed('s4a-' + position, true);
        }

        // append expects a function as input
        div.append(function() {
            return svg.node();
        });
    };

    var updateAllVizObjects = function(fn) {
        jQuery.each(vizObjects, function(position, vizObjectsAtPosition) {
            vizObjectsAtPosition.forEach(function(vizObj, idx) {
                fn(vizObj, position, vizObjectsAtPosition.length, idx);
            });
        });
    };

    /**
     * Overriden function from parent
     * Placing objects are handled through css
     */
    _self.redraw = function() {

    };

    return _self;
};

'use strict';
/* global s4a */
s4a.viz.layout = s4a.viz.layout || {};

/**
 * <p>This is an abstract top-level object that take care of layout for a group
 * of elements</p>
 *
 * @abstract
 * @constructor
 * @param {DOMElement} domElement
 */
s4a.viz.layout.Grid = function(domElement) {

    /**
     * Get view
     *
     * @abstract
     */
    function getView() {
        throw new Error('Must be implemented by sub-class');
    }

    return {
        getView: getView
    };

};

'use strict';
/* global s4a */
s4a.viz.layout = s4a.viz.layout || {};

/**
 * <p>This abstract top-level object handles layout for a group
 * of elements</p>
 *
 * @abstract
 * @constructor
 * @param {DOMElement} domElement
 */
s4a.viz.layout.Layout = function(domElement) {

    /**
     * Add vizualization object to layout
     *
     * @abstract
     */
    function add() {
        throw new Error('Must be implemented by sub-class');
    }

    /**
     * Redraw all vizualization objects added to the layout
     *
     * @abstract
     */
    function redraw() {
        throw new Error('Must be implemented by sub-class');
    }

    return {
        add: add,
        redraw: redraw
    };
};

'use strict';
s4a.extend('viz.map');

/**
 * Create a new BubblePie map object
 *
 * @class
 * @classdesc
 * BubblePie map object
 */
s4a.viz.map.BubblePie = function() {

};

'use strict';
/**
 * Create a new Choropleth map object
 *
 * @class
 * @classdesc
 * Choropleth map object
 */
s4a.viz.map.Choropleth = function() {

};

'use strict';
/**
 * Create a new Heat map object
 *
 * @class
 * @classdesc
 * Heat map object
 */
s4a.viz.map.Heat = function() {

};

'use strict';
/**
 * Create a new LiveData map object
 *
 * @class
 * @classdesc
 * LiveData map object
 */
s4a.viz.map.LiveData = function() {

};

'use strict';
/**
 * Map visualization objects
 * @class
 * @namespace s4a.viz.map
 */
s4a.viz.map = {};

/**
 * The transparency to apply to statistical areas, bubbles and their respective
 * legends
 *
 * @type {Number}
 */
s4a.viz.map.StatAreaAlpha = 0.75;

/**
 * Create a choropleth map layer for use in ol3
 *
 * @param {s4a.viz.ViewCoordinator} mapData
 * @param {s4a.viz.ChartData} mapConfig
 */
s4a.viz.map.ChoroplethMapLayer = function(mapData, mapConfig) {
    console.log('Not implemented');
};

/**
 * Create a bubble map layer for use in ol3
 *
 * @param {s4a.viz.ViewCoordinator} mapData
 * @param {s4a.viz.ChartData} mapConfig
 */
s4a.viz.map.BubbleMapLayer = function(mapData, mapConfig) {
    console.log('Not implemented');
};

/**
 * Draw a choropleth map inside the specified canvas
 *
 * @param {Object} pDomNode
 * @param {s4a.viz.ChartData} pChartData JSON
 */
s4a.viz.map.getMap = function(pDomNode, pChartData) {
    var mProjection, mPath, mStatGeometries, mBounds, s, t,
        mContext, mDomain, mColor, mColor2, mSizes, mColorScale,
        mColorScale2, mSizeScale, mDataMap, mDataMapMulti, mSeriesValues,
        mDataMap2, mSeriesValues2;

    // Determine default values for width/height if not present
    var pWidth = (pChartData.mapWidth === 'auto') ? jQuery(pDomNode).width() : pChartData.mapWidth;
    var pHeight = (pChartData.mapHeight === 'auto') ? jQuery(pDomNode).height() : pChartData.mapHeight;

    // Check if an existing canvas exists
    var mCanvas = jQuery(pDomNode + ' canvas');

    if (mCanvas.length < 1) {
        mCanvas = jQuery('<canvas/>');
        jQuery(pDomNode).append(mCanvas);
    }

    // Need to handle the type of statistical unit here! Presently assumes everything is "kommune"
    // Create HTML5 Canvas and return context
    mContext = mCanvas
        .prop('height', pHeight)
        .prop('width', pWidth)[0]
        .getContext('2d');

    // Set the number of domains - default to jenks natural breaks
    mDomain = pChartData.domains.map(function(pValue) {
        return Number(pValue);
    }) || null;

    // Set a default color scale
    mColor = pChartData.colors !== null && (pChartData.colors.length >= 1) ?
            s4a.viz.color[pChartData.colors[0]][mDomain.length] :
            s4a.viz.color.Reds[mDomain.length];

    // Set a default secondary color scale
    mColor2 = pChartData.colors !== null && (pChartData.colors.length >= 2) ?
            s4a.viz.color[pChartData.colors[1]][mDomain.length] :
            s4a.viz.color.Blues[mDomain.length];

    // Set a default size range (for bubble charts etc)
    mSizes = s4a.viz.Sizes.medium;

    // Construct a color scale
    mColorScale = d3.scale.threshold()
        .domain(mDomain)
        .range(mColor);

    // Construct a secondary color scale
    mColorScale2 = d3.scale.threshold()
        .domain(mDomain)
        .range(mColor2);

    // Construct a size scale
    mSizeScale = mSizes !== null ? d3.scale.threshold()
        .domain(mDomain)
        .range(mSizes) : null;

    // Construct a data map object
    mDataMap = {};

    // Construct a data map object that maps to multiple values per id
    mDataMapMulti = {};

    // Initialize a series values object
    mSeriesValues = [];

    // Construct a data map object for secondary data series
    mDataMap2 = {};

    // Initialize a series values object for secondary data  series
    mSeriesValues2 = [];

    for (var i = 0, j = pChartData.mapUnitIDs.length; i < j; i++) {

        mDataMapMulti[pChartData.mapUnitIDs[i]] = Number(pChartData.seriesData[i]);
        mDataMap[pChartData.mapUnitIDs[i]] =
                Number(pChartData.seriesData[i][pChartData.showSeries[0]]);
        mSeriesValues.push(Number(pChartData.seriesData[i][pChartData.showSeries[0]]));
    }

    if (pChartData.showSeries.length === 2) {
        for (i = 0, j = pChartData.mapUnitIDs.length; i < j; i++) {
            mDataMap2[pChartData.mapUnitIDs[i]] =
                Number(pChartData.seriesData[i][pChartData.showSeries[1]]);
            mSeriesValues2.push(Number(pChartData.seriesData[i][pChartData.showSeries[1]]));
        }
    }

    if (pChartData.title === null || pChartData.title === undefined || pChartData.title === '') {
        if (pChartData.showSeries.length > 1) {
            pChartData.title = pChartData.seriesLabels[pChartData.showSeries[0]] + ' / ' +
                pChartData.seriesLabels[pChartData.showSeries[2]];
        } else {
            pChartData.title = pChartData.seriesLabels[pChartData.showSeries[0]];
        }
    }

    // Load the data and basemap JSON files
    queue()
            .defer(d3.json, './data/data-topojson.json')
            .defer(d3.json, './data/sea.json')
            .await(function(pError, pStatAreas, pBaseMap) {

                //Create a d3.geo.projection object
                mProjection = d3.geo.transverseMercator()
                    .scale(1)
                    .translate([0, 0]);

                // Create a d3.geo.path object
                mPath = d3.geo.path()
                    .projection(mProjection);

                // Read all topojson features into a GeoJson object
                mStatGeometries = topojson.feature(pStatAreas, pStatAreas.objects.kommune)
                .features.filter(function(d) {
                    return (pChartData.mapUnitIDs.indexOf(d.id.toString()) !== -1);
                });

                // Get the complete bounds of all features and calculate scale and translation
                //var mBounds = mPath.bounds(zoomArea),
                mBounds = s4a.viz.map.util.getFeatureCollectionBounds(mPath, mStatGeometries);

                // Calculate the scale factor
                s = 0.95 / Math.max(
                        (mBounds[1][0] - mBounds[0][0]) / pWidth,
                        (mBounds[1][1] - mBounds[0][1]) / pHeight);

                // Calculate the translation offset from zero
                t = [(pWidth - s * (mBounds[1][0] + mBounds[0][0])) / 2,
                    (pHeight - s * (mBounds[1][1] + mBounds[0][1])) / 2];

                // Update projection
                mProjection
                        .scale(s)
                        .translate(t);

                // Clear the canvas and prepare for drawing
                mContext.clearRect(0, 0, pWidth, pHeight);

                // Set white background color
                mContext.fillStyle = '#ffffff';
                mContext.fillRect(0, 0, pWidth, pHeight);

                // Draw basemap features I
                s4a.viz.map.shared._drawLand(mContext, mPath, pBaseMap);

                // Conditionally draw choropleth polygons
                if (pChartData.mapType === 'choroplethMap' ||
                        pChartData.mapType === 'bubbleChoroplethMap') {
                    s4a.viz.map.shared._drawPolygons(mStatGeometries, mDataMap, mColorScale, mPath, mContext);
                }

                // Draw basemap features II
                s4a.viz.map.shared._drawMunicipality(mContext, mPath, pStatAreas);
                s4a.viz.map.shared._drawCounty(mContext, mPath, pStatAreas);

                // Conditionally draw bubbles
                if (pChartData.mapType === 'bubbleMap') {
                    s4a.viz.map.shared._drawBubbles(mStatGeometries, mDataMap, mSizeScale, mColorScale,
                            mPath, mContext);
                }
                // Conditionally draw additional bubbles (series 2)
                else if (pChartData.mapType === 'bubbleChoroplethMap') {
                    s4a.viz.map.shared._drawBubbles(mStatGeometries, mDataMap2, mSizeScale, mColorScale2,
                            mPath, mContext);
                }
                // Conditionally draw pie charts
                else if (pChartData.mapType === 'pieChartMap') {
                    s4a.viz.map.shared._drawPieCharts(mStatGeometries, mDataMapMulti, mColor, mPath,
                            mContext);
                }

                // Draw labels
                s4a.viz.map.shared._drawLabels(mContext, mPath, mStatGeometries, (pChartData.fontSize - 2));

                // Draw legend
                s4a.viz.map.shared._drawRectSymMapLegend(mContext, mColorScale, pChartData.title,
                    Number(pChartData.fontSize));

                return mContext;
            });
};

'use strict';
s4a.extend('viz.map');

/**
 * Create a new Prism chart object
 *
 * @class
 * @classdesc
 * Prism chart object
 */
s4a.viz.map.Prism = function() {

};

'use strict';
/**
 * Define namespace utilities
 * @namespace
 * @type {Object}
 */
s4a.viz.map.shared = {};

/**
 * Draws the chart title
 *
 * @param {Object} pContext
 * @param {Number} pFontSize
 * @param {String} pTitle
 * @param {Number} pLeftMargin
 * @param {Number} pCurrentLinePosition
 * @returns {Number}
 */
s4a.viz.map.shared._drawChartTitle =
        function(pContext, pFontSize, pTitle, pLeftMargin, pCurrentLinePosition) {
            pContext.font = 'bolder ' + pFontSize + 'px Arial';
            pContext.textAlign = 'start'; // Right align the labels
            pContext.fillStyle = '#000000';
            pContext.fillText(pTitle, pLeftMargin, pCurrentLinePosition);

            return (pCurrentLinePosition += (pFontSize * 2));
        };

/**
 * Draw map legend on canvas using a color scale
 *
 * @param {Object} pContext A drawing context retrieved by calling
 * c.getContext("2d") on the HTML5 canvas element c
 * @param {Object} pColor A d3js threshold scale created by the funciton d3.scale.threshold()
 * @param {String} pTitle The title to print on top of the legend
 */
s4a.viz.map.shared._drawRectSymMapLegend = function(pContext, pColor, pTitle, pFontSize) {

    pFontSize = pFontSize !== undefined ? pFontSize : s4a.viz.map.FontSizes.normal;

    var mLeftMargin = 10;
    var mTopMargin = 10;
    var mLineHeight = pFontSize * 1.8;
    var mKeyW = 20;
    var mKeyH = pFontSize + 4;

    var mYPos = mTopMargin + pFontSize;
    // Get the length of the longest legend label entry
    var mLongestLabel = s4a.viz.map.util.getLongestStringInArray(pColor.domain());
    pContext.font = pFontSize + 'px Arial';
    var mRightAlignInset = pContext.measureText(mLongestLabel).width * 2;

    if (pTitle !== undefined && pTitle !== null && pTitle !== '') {
        mYPos = s4a.viz.map.shared._drawChartTitle(pContext, pFontSize, pTitle, mLeftMargin, mYPos);
    }

    pContext.font = pFontSize + 'px Arial';
    pContext.textAlign = 'end'; // Right align the labels

    // For each color in the scale
    for (var j = pColor.domain().length - 1; j > 0; j--) {
        var mLabel;
        if (j === pColor.domain().length - 1) {
            mLabel = '> ' + jQuery.number(pColor.domain()[j - 1]);
        } else if (j === 1) {
            mLabel = '< ' + jQuery.number(pColor.domain()[j]);
        } else {
            mLabel = jQuery.number(pColor.domain()[j - 1]) + ' - ' + jQuery.number(pColor.domain()[j]);
        }

        // Set legend symbol colors
        pContext.fillStyle = pColor.range()[j];
        pContext.strokeStyle = '#000000';
        pContext.lineWidth = 0.2;
        // Add legend symbol
        pContext.beginPath();
        pContext.rect(mLeftMargin, mYPos - pFontSize, mKeyW, mKeyH);
        pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
        pContext.fill();
        pContext.globalAlpha = 1.0;
        pContext.stroke();
        // Add legend label
        pContext.fillStyle = '#000000';
        pContext.fillText(mLabel, mLeftMargin + mKeyW + mLeftMargin + mRightAlignInset, mYPos);
        // Move to next line
        mYPos += mLineHeight;
    }
};

/**
 * Draw polygons from geometry collection
 *
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {Object} pDataMap A JavaScript object with key/value pairs
 * @param {Object} pScale A d3.scale.threshold object
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pContext A Canvas 2d-context
 */
s4a.viz.map.shared._drawPolygons = function(pGeoJson, pDataMap, pScale, pPath, pContext) {
    pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
    var mRange = pScale.domain();
    var mMax = Math.max.apply(null, mRange);
    var mMin = Math.min.apply(null, mRange);
    pGeoJson.forEach(function(pFeature) {
        var mTestValue = pDataMap[pFeature.id];
        mTestValue = mTestValue < mMax ? mTestValue : mMax - 0.0001;
        mTestValue = mTestValue >= mMin ? mTestValue : mMin;
        var mColor = pScale(mTestValue);
        if (mColor !== undefined) {
            pContext.fillStyle = mColor;
            pContext.beginPath();
            pPath.context(pContext)(pFeature);
            pContext.fill();
        }
    });
    pContext.globalAlpha = 1.0;
};

/**
 * Draw polygons from geometry collection
 *
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {Object} pDataMapMulti A JavaScript object with key/value pairs
 * @param {Object} pColor A d3js threshold scale created by the funciton d3.scale.threshold()
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pContext A Canvas 2d-context
 */
s4a.viz.map.shared._drawPieCharts = function(pGeoJson, pDataMapMulti, pColor, pPath, pContext) {
    pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
    pGeoJson.forEach(function(mFeature) {
        var mSize = 25;
        var mSlices = s4a.viz.map.util.valuesToSlices(pDataMapMulti[mFeature.id]);
        var mStartAngle = 1.5 * Math.PI;
        var mPoint = pPath.centroid(mFeature);
        for (var i = 0, j = mSlices.length; i < j; i++) {
            var mSlice = (Number(mSlices[i]) * (2 * Math.PI)) / 100;
            var mFinishAngle = mStartAngle + mSlice;
            if (mFinishAngle > (2 * Math.PI)) {
                mFinishAngle = mFinishAngle - (2 * Math.PI);
            }
            pContext.fillStyle = pColor[i];
            pContext.lineWidth = 2;
            pContext.strokeStyle = 'rgba(0,0,0,0.25)';
            pContext.beginPath();
            pContext.moveTo(mPoint[0], mPoint[1]);
            pContext.arc(mPoint[0], mPoint[1], mSize, mStartAngle, mFinishAngle, false);
            pContext.closePath();
            pContext.fill();
            pContext.stroke();
            mStartAngle += mSlice;
        }
    });
};

/**
 * Draw map legend on canvas using scale
 *
 * @param {Object} pContext A drawing context retrieved by calling c.getContext("2d") on the HTML5 canvas element c
 * @param {Object} pColor A d3js threshold scale created by the funciton d3.scale.threshold()
 * @param {String} pTitle The title to print on top of the legend
 */
s4a.viz.map.shared._drawCircleSymMapLegend = function(pContext, pColor, pTitle) {

    var mFontSize = 12;
    var mLeftMargin = 10;
    var mTopMargin = 10;
    var mLineHeight = mFontSize * 1.5;
    var mCurrentLinePosition = mTopMargin + mFontSize;
    // Get the length of the longest legend label entry
    var mRightAlignInset = s4a.viz.map.util.getLengthOfLongest(pColor.domain()) * (mFontSize / 1.5);
    // Insert logic for legend height here
    pContext.font = mFontSize + 'px Arial Bold';
    pContext.textAlign = 'start'; // Right align the labels
    pContext.fillStyle = '#000000';
    pContext.fillText('Teiknforklaring', mLeftMargin, mCurrentLinePosition);
    mCurrentLinePosition += mLineHeight;
    // Set font for legend items
    pContext.font = mFontSize + 'px Arial';
    pContext.textAlign = 'end'; // Right align the labels

    // For each color in the scale
    for (var j = pColor.domain().length - 1; j > 0; j--) {

        var mLabel = jQuery.number(pColor.domain()[j - 1]) + ' - ' + jQuery.number(pColor.domain()[j]);
        // Set legend symbol colors
        pContext.fillStyle = pColor.range()[j];
        pContext.strokeStyle = '#000000';
        pContext.lineWidth = 0.2;
        // Add legend symbol
        pContext.beginPath();
        pContext.arc(mLeftMargin, mCurrentLinePosition - (mFontSize / 2), 6, 0, 2 * Math.PI, false);
        //        pCanvas.arc(mFeat[0], mFeat[1], mSize, 0, 2 * Math.PI, false);
        pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
        pContext.fill();
        pContext.globalAlpha = 1;
        pContext.stroke();
        // Add legend label
        pContext.fillStyle = '#000000';
        pContext.fillText(mLabel, mLeftMargin + mRightAlignInset, mCurrentLinePosition);
        // Move to next line
        mCurrentLinePosition += mLineHeight;
    }
};

/**
 * Draw polygons from geometry collection
 *
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {Object} pDataMap A JavaScript object with key/value pairs
 * @param {Object} pSizeScale A d3.scale.threshold object mapping to bubble sizes
 * @param {Object} pColorScale A d3.scale.threshold object mapping to bubble colors
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pContext A Canvas 2d-context
 */
s4a.viz.map.shared._drawBubbles = function(pGeoJson, pDataMap, pSizeScale, pColorScale, pPath, pContext) {
    pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
    pGeoJson.forEach(function(pFeature) {
        var mSize = pSizeScale(pDataMap[pFeature.id]);
        var mColor = pColorScale(pDataMap[pFeature.id]);
        if (mSize !== undefined) {
            var mFeat = pPath.centroid(pFeature);
            pContext.beginPath();
            pContext.arc(mFeat[0], mFeat[1], mSize, 0, 2 * Math.PI, false);
            pContext.fillStyle = mColor;
            pContext.fill();
            pContext.lineWidth = 2;
            pContext.strokeStyle = 'rgba(0,0,0,0.25)';
            pContext.stroke();
        }
    });
    pContext.globalAlpha = 1;
};

/**
 * Place labels on top of polygons
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath d3.geo.path object
 * @param {Object} pGeoJson
 * @param {Number} pFontSize
 */
s4a.viz.map.shared._drawLabels = function(pContext, pPath, pGeoJson, pFontSize) {

    pFontSize = pFontSize !== undefined ? pFontSize : s4a.viz.map.FontSizes.small;

    pGeoJson.forEach(function(pFeature) {
        var xy = pPath.centroid(pFeature);
        pContext.font = pFontSize + 'px Arial';
        pContext.textAlign = 'center'; // Right align the labels
        pContext.fillStyle = '#000000';
        pContext.fillText(pFeature.properties.name, xy[0], xy[1]);
    });
};

/**
 * Draw a geojson object on the canvas
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {String} pLineColor
 * @param {String} pFillColor
 * @param {Number} pLineWidth
 */
s4a.viz.map.shared._drawGeoJson = function(pContext, pPath, pGeoJson, pLineColor, pFillColor, pLineWidth) {
    pContext.strokeStyle = pLineColor || 'transparent';
    pContext.lineWidth = pLineWidth;
    pContext.fillStyle = pFillColor || 'transparent';
    pContext.beginPath();
    pPath.context(pContext)(pGeoJson);
    if (pFillColor !== 'transparent') {
        pContext.fill();
    }
    if (pLineColor !== 'transparent') {
        pContext.stroke();
    }
    return;
};

/**
 * Draw municipality borders on the map
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pStatUnitTopoJson
 */
s4a.viz.map.shared._drawMunicipality = function(pContext, pPath, pStatUnitTopoJson) {
    var mKommune = topojson.mesh(pStatUnitTopoJson, pStatUnitTopoJson.objects.kommune, function(a, b) {
        return a.id !== b.id;
    });
    s4a.viz.map.shared._drawGeoJson(pContext, pPath, mKommune, '#000000', null, 0.5);
};

/**
 * Draw county borders on the map
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pStatUnitTopoJson
 */
s4a.viz.map.shared._drawCounty = function(pContext, pPath, pStatUnitTopoJson) {
    var mCounty = topojson.mesh(pStatUnitTopoJson, pStatUnitTopoJson.objects.fylke, function(a, b) {
        return a.id !== b.id;
    });
    s4a.viz.map.shared._drawGeoJson(pContext, pPath, mCounty, '#000000', null, 1);
};

/**
 * Draw land polygon on the map
 *
 * @param {Object} pContext HTML5 2d-drawing context
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pLandTopoJson
 */
s4a.viz.map.shared._drawLand = function(pContext, pPath, pLandTopoJson) {
    var mLand = topojson.feature(pLandTopoJson, pLandTopoJson.objects.sea);
    s4a.viz.map.shared._drawGeoJson(pContext, pPath, mLand, '#999999', '#eeeeee', 0.2);
};

'use strict';
/**
 * Create a new Symbol map object
 *
 * @class
 * @classdesc
 * Symbol map object
 */
s4a.viz.map.Symbol = function() {

};

'use strict';
/**
 * Namespace for map related utilities
 * @namespace
 */
s4a.viz.map.util = {};

/**
 * Return a unique URL to ensure that scripts/styles are reloaded every time
 *
 * @param {String} pUrl An URL
 * @returns {String} URL with unique suffix
 */
s4a.viz.map.util.secureReload = function(pUrl) {
    var mConcatChar = pUrl.indexOf('?' !== -1) ? '?' : '&';
    return pUrl + mConcatChar + 'rnd=' + (Math.random() * 100).toString();
};

/**
 * Returns the number of characters in the longest formatted number in an array of numbers
 *
 * @param {number[]} numberArray An array of numbers to be measured
 * @returns {number} The number of characters in the longest number
 */
s4a.viz.map.util.getLengthOfLongest = function(numberArray) {
    var mLength = 0;
    if (numberArray !== null && numberArray.length > 1) {
        var tmpLength;
        for (var i = (numberArray.length - 1); i > 0; i--) {
            var mLabel = jQuery.number(numberArray[i - 1]) + ' - ' + jQuery.number(numberArray[i]);
            tmpLength = mLabel.length;
            if (tmpLength > mLength) {
                mLength = tmpLength;
            }
        }
    }
    return mLength;
};

/**
 * Return the longest entry from an array
 *
 * @param {Array} pArray
 * @returns {String}
 */
s4a.viz.map.util.getLongestStringInArray = function(pArray) {
    var mArray = pArray.slice();
    return mArray.sort(function(a, b) {
        return b.toString().length - a.toString().length;
    })[0];
};

/**
 * Get the total product of the items in an array of numbers, i.e. passing the
 * array [1,3,4,5] to this function will return 1+3+4+5 = 13. Non-numeric values
 * will be ignored.
 *
 * @param {Number} pDataArray An array of numbers
 * @returns {Number}
 */
s4a.viz.map.util.getTotal = function(pDataArray) {
    var pTotal = 0;
    for (var j = 0; j < pDataArray.length; j++) {
        pTotal += (typeof pDataArray[j] === 'number') ? pDataArray[j] : 0;
    }
    return pTotal;
};

/**
 * Method to transform json returned by xml2json to the correct format for the
 * chart data object
 *
 * @param {Object} pObject
 * @returns {AASDiag.ChartData}
 */
s4a.viz.map.util.fixJsonData = function(pObject) {
    var mChartData = new s4a.viz.ChartData();
    mChartData.title = pObject.title[0] || null;
    mChartData.mapType = pObject.type !== undefined ? pObject.type : mChartData.mapType;
    mChartData.mapUnitType = pObject.mapUnitType;
    mChartData.mapUnitIDs = pObject.categoryLabels.string;
    mChartData.seriesLabels = pObject.title.string;
    mChartData.seriesData = s4a.viz.map.util.fixSeriesJsonData(pObject.seriesData);
    mChartData.domains = pObject.intervals.float;
    mChartData.showLabels = pObject.showLabels || false;
    mChartData.showSeries = pObject.showSeries || [0];

    //Special handling of colors
    if (pObject.palette !== undefined) {
        mChartData.colors = pObject.palette !== undefined ? [pObject.palette] : mChartData.colors;
    } else {
        mChartData.colors = pObject.colors !== undefined ? [pObject.colors] : mChartData.colors;
    }

    return mChartData;
};

/**
 * Transform the series data object
 *
 * @param {Object} pSeriesData
 * @returns {Array} Array of arrays containing series data
 */
s4a.viz.map.util.fixSeriesJsonData = function(pSeriesData) {
    var mSeriesData = [];
    for (var i = 0; i < pSeriesData.ArrayOfDecimal.length; i++) {
        mSeriesData.push(pSeriesData.ArrayOfDecimal[i].decimal);
    }
    return mSeriesData;
};

/**
 * Return the bounds of a feature collections
 *
 * @param {Object} pPath A d3.js geo.path
 * @param {type} pFeatures An array of geojson features
 * @returns {Array} The combined bounds of the features [[xmin,ymin], [xmax,ymax]]
 */
s4a.viz.map.util.getFeatureCollectionBounds = function(pPath, pFeatures) {
    var mBounds = [[null, null], [null, null]];
    for (var i = 0, j = pFeatures.length; i < j; i++) {
        var mCBounds = pPath.bounds(pFeatures[i]);
        if (!mBounds[0][0] || mCBounds[0][0] < mBounds[0][0]) {
            mBounds[0][0] = mCBounds[0][0];
        }
        if (!mBounds[0][1] || mCBounds[0][1] < mBounds[0][1]) {
            mBounds[0][1] = mCBounds[0][1];
        }
        if (!mBounds[1][0] || mCBounds[1][0] > mBounds[1][0]) {
            mBounds[1][0] = mCBounds[1][0];
        }
        if (!mBounds[1][1] || mCBounds[1][1] > mBounds[1][1]) {
            mBounds[1][1] = mCBounds[1][1];
        }
    }
    return mBounds;
};

s4a.viz.map.util.valuesToSlices = function(pSeries) {
    if (pSeries !== undefined && typeof pSeries === 'object' && Array.isArray(pSeries) === true) {
        var mSum = 0;
        for (var i = 0, j = pSeries.length; i < j; i++) {
            mSum = mSum + Number(pSeries[i]);
        }
        var mSlices = [];
        for (i = 0, j = pSeries.length; i < j; i++) {
            mSlices.push((Number(pSeries[i]) * 100) / mSum);
        }
        return mSlices;
    } else {
        return pSeries;
    }

};

'use strict';
s4a.viz.map.util = {};

/**
 * Return a unique URL to ensure that scripts/styles are reloaded every time
 *
 * @param {String} pUrl An URL
 * @returns {String} URL with unique suffix
 */
s4a.viz.map.util.secureReload = function(pUrl) {
    var mConcatChar = pUrl.indexOf('?' !== -1) ? '?' : '&';
    return pUrl + mConcatChar + 'rnd=' + (Math.random() * 100).toString();
};

/**
 * Returns the number of characters in the longest formatted number in an array of numbers
 *
 * @param {number[]} numberArray An array of numbers to be measured
 * @returns {number} The number of characters in the longest number
 */
s4a.viz.map.util.getLengthOfLongest = function(numberArray) {
    var mLength = 0;
    if (numberArray !== null && numberArray.length > 1) {
        var tmpLength;
        for (var i = (numberArray.length - 1); i > 0; i--) {
            var mLabel = jQuery.number(numberArray[i - 1]) + ' - ' + jQuery.number(numberArray[i]);
            tmpLength = mLabel.length;
            if (tmpLength > mLength) {
                mLength = tmpLength;
            }
        }
    }
    return mLength;
};

/**
 * Return the longest entry from an array
 *
 * @param {Array} pArray
 * @returns {String}
 */
s4a.viz.map.util.getLongestStringInArray = function(pArray) {
    var mArray = pArray.slice();
    return mArray.sort(function(a, b) {
        return b.toString().length - a.toString().length;
    })[0];
};

/**
 * Get the total product of the items in an array of numbers, i.e. passing the
 * array [1,3,4,5] to this function will return 1+3+4+5 = 13. Non-numeric values
 * will be ignored.
 *
 * @param {Number} pDataArray An array of numbers
 * @returns {Number}
 */
s4a.viz.map.util.getTotal = function(pDataArray) {
    var pTotal = 0;
    for (var j = 0; j < pDataArray.length; j++) {
        pTotal += (typeof pDataArray[j] === 'number') ? pDataArray[j] : 0;
    }
    return pTotal;
};

/**
 * Method to transform json returned by xml2json to the correct format for the
 * chart data object
 *
 * @param {Object} pObject
 * @returns {AASDiag.ChartData}
 */
s4a.viz.map.util.fixJsonData = function(pObject) {
    var mChartData = new s4a.viz.ChartData();
    mChartData.title = pObject.title[0] || null;
    mChartData.mapType = pObject.type !== undefined ? pObject.type : mChartData.mapType;
    mChartData.mapUnitType = pObject.mapUnitType;
    mChartData.mapUnitIDs = pObject.categoryLabels.string;
    mChartData.seriesLabels = pObject.title.string;
    mChartData.seriesData = s4a.viz.map.util.fixSeriesJsonData(pObject.seriesData);
    mChartData.domains = pObject.intervals.float;
    mChartData.showLabels = pObject.showLabels || false;
    mChartData.showSeries = pObject.showSeries || [0];

    //Special handling of colors
    if (pObject.palette !== undefined) {
        mChartData.colors = pObject.palette !== undefined ? [pObject.palette] : mChartData.colors;
    } else {
        mChartData.colors = pObject.colors !== undefined ? [pObject.colors] : mChartData.colors;
    }

    return mChartData;
};

/**
 * Transform the series data object
 *
 * @param {Object} pSeriesData
 * @returns {Array} Array of arrays containing series data
 */
s4a.viz.map.util.fixSeriesJsonData = function(pSeriesData) {
    var mSeriesData = [];
    for (var i = 0; i < pSeriesData.ArrayOfDecimal.length; i++) {
        mSeriesData.push(pSeriesData.ArrayOfDecimal[i].decimal);
    }
    return mSeriesData;
};

/**
 * Return the bounds of a feature collections
 *
 * @param {Object} pPath A d3.js geo.path
 * @param {type} pFeatures An array of geojson features
 * @returns {Array} The combined bounds of the features [[xmin,ymin], [xmax,ymax]]
 */
s4a.viz.map.util.getFeatureCollectionBounds = function(pPath, pFeatures) {
    var mBounds = [[null, null], [null, null]];
    for (var i = 0, j = pFeatures.length; i < j; i++) {
        var mCBounds = pPath.bounds(pFeatures[i]);
        if (!mBounds[0][0] || mCBounds[0][0] < mBounds[0][0]) {
            mBounds[0][0] = mCBounds[0][0];
        }
        if (!mBounds[0][1] || mCBounds[0][1] < mBounds[0][1]) {
            mBounds[0][1] = mCBounds[0][1];
        }
        if (!mBounds[1][0] || mCBounds[1][0] > mBounds[1][0]) {
            mBounds[1][0] = mCBounds[1][0];
        }
        if (!mBounds[1][1] || mCBounds[1][1] > mBounds[1][1]) {
            mBounds[1][1] = mCBounds[1][1];
        }
    }
    return mBounds;
};

s4a.viz.map.util.valuesToSlices = function(pSeries) {
    if (pSeries !== undefined && typeof pSeries === 'object' && Array.isArray(pSeries) === true) {
        var mSum = 0;
        for (var i = 0, j = pSeries.length; i < j; i++) {
            mSum = mSum + Number(pSeries[i]);
        }
        var mSlices = [];
        for (i = 0, j = pSeries.length; i < j; i++) {
            mSlices.push((Number(pSeries[i]) * 100) / mSum);
        }
        return mSlices;
    } else {
        return pSeries;
    }

};
