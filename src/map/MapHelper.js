/**
 * A helper class to quickly add maps to your HTML5 applications
 *
 * @class
 */
s4a.map.MapHelper = function(nodeSelector) {

    if (nodeSelector === undefined) {
        return;
    }

    this.id = nodeSelector;
    this.zoomLevel = 12;
    this.extent = new ol.extent(-180, -90, 180, 90);
    this.layers = [];
    this.activeLayer = 0;
    this.tools = [];
    this.activeTool = 0;

    /**
     * Add a tool to the map
     *
     * @param {s4a.map.ITool} tool An object implementing the ITool interface
     */
    this.addTool = function(tool) {
        return this;
    };

    /**
     * Add data to the map
     *
     * @param {String} json Local or remote URL of JSON document
     */
    this.addData = function(json) {
        return this;
    };

};
