s4a.map = (function() {

    var _key, olMap;

    /**
     * Create a map
     * @param {DOMElement|String} nodeId The element or id of an element in
     * your page that will contain the map.
     * @param {s4a.config} default map config
     */
    function createMap(nodeId, cfg) {
        cfg = cfg || s4a.config.loadConfig();

        var center = [cfg.center.x, cfg.center.y],
            mercator = 'EPSG:3857';

        if (cfg.center.epsg !== mercator) {
            center = ol.proj.transform(center, cfg.center.epsg, mercator);
        }

        olMap = new ol.Map({
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

        return this;
    }

    /**
     * Add a unique identifier that describes the application scope
     * @param {string} key
     */
    function addKey(key) {
        _key = key;
    }

    function addLayer (layer) {
        olMap.addLayer(layer);
    }

    /**
     * Create a sd4 map layer
     * @param {String} Layer name must exist on server an be avilable
     * in the current application scope (@see s4a.map.addKey).
     */
    function createMapLayer(nameOfLayer, extraParams) {
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
    }

    function getDomElement() {
        return $(olMap.getViewport());
    }

    function getOlMap() {
        return olMap;
    }

    return {
        addKey: addKey,
        createMap: createMap,
        createMapLayer: createMapLayer,
        getDomElement:getDomElement,
        getOlMap: getOlMap
    };
})();
