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
