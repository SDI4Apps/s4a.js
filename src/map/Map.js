/* global s4a */
s4a.map = {};

/**
 * Create a map
 * 
 * @constructor
 * @param {DOMElement|String} nodeId The element or id of an element in
 * your page that will contain the map.
 * @param {s4a.config} default map config
 */
s4a.map.Map = function(nodeId, cfg) {
    var vizLayers = [],
        _self = this,
        _key;

    cfg = cfg || s4a.config.loadConfig();

    var center = [cfg.center.x, cfg.center.y],
        mercator = 'EPSG:3857';

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
     * @param {string} key
     */
    _self.addKey = function(key) {
        _key = key;
    };

    /**
     * Create a sd4 map layer
     * @param {String} Layer name must exist on server an be avilable
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
     * @param {number} lon
     * @param {number} lat
     */
    _self.projectPoint = function(x, y) {
        var point = ol.proj.transform([x, y], 'EPSG:4326', 'EPSG:3857');
        return olMap.getPixelFromCoordinate(point);
    };

    _self.redraw = function() {
        jQuery.each(vizLayers, function(position, vizLayer) {
            if (vizLayer.redraw) {
                vizLayer.redraw();
            }
            else {
                console.debug('s4a.map.Map:', 'Object does not implement the redraw interface:', vizLayer);
            }
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
