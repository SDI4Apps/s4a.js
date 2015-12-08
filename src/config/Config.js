s4a.config = (function() {

    /**
     * Load config
     *
     * @param {Object} cfg Override any defaults
     */
    function _loadConfig(cfg) {
        cfg = cfg || {};

        // default config
        var config = {
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

        return $.extend(config, cfg);
    }

    return {
        loadConfig: _loadConfig
    };

})();
