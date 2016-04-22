s4a.extend('config');

s4a.config = (function () {
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
    module.loadConfig = function (configObject) {

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
