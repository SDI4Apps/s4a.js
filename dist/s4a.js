/*! s4a - v0.1.0 - 2015-10-15
* https://github.com/SDI4Apps/s4a.js
* Copyright (c) 2015 SDI4Apps Partnership; Licensed Apache2 */
/**
 * <p>SDI4Apps client-side library for rapid application development based on the
 * SDI4Apps platform OpenAPI</p>
 * <p>Functions to draw statistical maps for use with OpenLayers based applications.</p>
 * 
 * @namespace
 * @requires d3.v3
 * @requires jQuery-1.10.2
 * @requires jQuery-xml2json
 * @requires jQuery-number-2.1.3
 * @requires topojson
 * @requires simple-statistics
 * @requires queue.v1
 * @requires topojson.v1
 */

var s4a = {
    /**
     * Version number of the s4a.js library
     * @type Number
     */
    version: '0.1.0'
};
/* global s4a */

/**
 * Namespace for all objects related to visualization of map and tabular data
 * @namespace
 */
s4a.viz = {};
/* global s4a */

/**
 * Enumeration 
 * @enum {number}
 * @readonly
 */
s4a.viz.VizTypes = {
    /**
     * Diagram
     */
    'diagram': 1,
    /**
     * Map
     */
    'map': 2
};
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
 * @abstract
 * @constructor
 * @param {s4a.viz.ViewCoordinator} viewCoordinator
 * @param {DOMElement} domElement
 * @returns {s4a.viz.VizObj}
 */
s4a.viz.VizObj = function (viewCoordinator, domElement) {

    var _self = this,
            _viewCoordinator = viewCoordinator;
    _viewCoordinator.subscribe(_self);

    /**
     * Update the visualization
     * @abstract
     */
    this.update = function () {
        throw new Error('Must be implemented by sub-class');
    };

    /**
     * Apply a filter to the visualization
     * @abstract
     */
    this.filter = function (filter) {
        throw new Error('Must be implemented by sub-class');
    };
    
};
/* global s4a */

/**
 * A top level object that coordinates data and visualizations 
 * @param {Object} pData
 * @constructor
 * @returns {s4a.viz.ViewCoordinator}
 */
s4a.viz.ViewCoordinator = function (pData) {

    var _data = pData,
            _listeners = [],
            _self = this;

    /**
     * Subscribes an object to publish events from the ViewCoordinator
     * @returns {s4a.viz.ViewCoordinator}
     */
    this.publish = function () {
        for (var i = 0; i < _listeners.length; i++) {
            var listener = _listeners[i];
            if (typeof listener.update !== 'undefined') {
                _listeners[i].update(this._data);
                console.info('Published ' + i);
            } else {
                console.debug('Subscribed object ' + i + ' does not implement the update interface');
            }
        }
        return this;
    };

    var _setData = function (pData) {
        console.info('Updated data');
        _data = pData;
        _self.publish();
    };


    /**
     * Update the data object
     * @param {Object} t
     * @returns {s4a.viz.ViewCoordinator}
     */
    this.test = function (t) {
        _setData(t);
        return this;
    };

    /**
     * Subscribe an object to the ViewCoordinator
     * @param {Object} pObj
     * @returns {s4a.viz.ViewCoordinator}
     */
    this.subscribe = function (pObj) {
        if (_listeners.indexOf(pObj) < 0) {
            _listeners.push(pObj);
        }
        return this;
    };

    /**
     * Unsubscribe an object from the ViewCoordinator
     * @param {Object} pObj
     * @returns {s4a.viz.ViewCoordinator}
     */
    this.unsubscribe = function (pObj) {
        var _modListeners = [];
        for (var i = 0; i < _listeners.length; i++) {
            if (_listeners[i] !== pObj) {
                _modListeners.push(_listeners[i]);
            }
        }
        _listeners = _modListeners;
        return this;
    };

    this.applyFilter = function () {
        _self.publish();
        return this;
    };

};
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
        3: ["#f7fcb9", "#addd8e", "#31a354"],
        4: ["#ffffcc", "#c2e699", "#78c679", "#238443"],
        5: ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"],
        6: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837"],
        7: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
        8: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
        9: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"]
    },
    /**
     * Yellow through Green to Blue
     * @type Object
     */
    YlGnBu: {
        3: ["#edf8b1", "#7fcdbb", "#2c7fb8"],
        4: ["#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"],
        5: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
        6: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"],
        7: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
        8: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
        9: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"]
    },
    /**
     * Green to blue
     * @type Object
     */
    GnBu: {
        3: ["#e0f3db", "#a8ddb5", "#43a2ca"],
        4: ["#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe"],
        5: ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
        6: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac"],
        7: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
        8: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
        9: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"]
    },
    /**
     * Blue to green
     * @type Object
     */
    BuGn: {
        3: ["#e5f5f9", "#99d8c9", "#2ca25f"],
        4: ["#edf8fb", "#b2e2e2", "#66c2a4", "#238b45"],
        5: ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
        6: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#2ca25f", "#006d2c"],
        7: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
        8: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
        9: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"]
    },
    /**
     * Purple through blue to green
     * @type Object
     */
    PuBuGn: {
        3: ["#ece2f0", "#a6bddb", "#1c9099"],
        4: ["#f6eff7", "#bdc9e1", "#67a9cf", "#02818a"],
        5: ["#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59"],
        6: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#1c9099", "#016c59"],
        7: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
        8: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
        9: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"]
    },
    /**
     * Purple to blue
     * @type Object
     */
    PuBu: {
        3: ["#ece7f2", "#a6bddb", "#2b8cbe"],
        4: ["#f1eef6", "#bdc9e1", "#74a9cf", "#0570b0"],
        5: ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"],
        6: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe", "#045a8d"],
        7: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
        8: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
        9: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"]
    },
    /**
     * Blue to purple
     * @type Object
     */
    BuPu: {
        3: ["#e0ecf4", "#9ebcda", "#8856a7"],
        4: ["#edf8fb", "#b3cde3", "#8c96c6", "#88419d"],
        5: ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"],
        6: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8856a7", "#810f7c"],
        7: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
        8: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
        9: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]
    },
    /**
     * Red to purple
     * @type Object
     */
    RdPu: {
        3: ["#fde0dd", "#fa9fb5", "#c51b8a"],
        4: ["#feebe2", "#fbb4b9", "#f768a1", "#ae017e"],
        5: ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"],
        6: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177"],
        7: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
        8: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
        9: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"]
    }, PuRd: {
        3: ["#e7e1ef", "#c994c7", "#dd1c77"],
        4: ["#f1eef6", "#d7b5d8", "#df65b0", "#ce1256"],
        5: ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"],
        6: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#dd1c77", "#980043"],
        7: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
        8: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
        9: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"]
    }, OrRd: {
        3: ["#fee8c8", "#fdbb84", "#e34a33"],
        4: ["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f"],
        5: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
        6: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"],
        7: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
        8: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
        9: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]
    }, YlOrRd: {
        3: ["#ffeda0", "#feb24c", "#f03b20"],
        4: ["#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c"],
        5: ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"],
        6: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"],
        7: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
        8: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
        9: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]
    }, YlOrBr: {
        3: ["#fff7bc", "#fec44f", "#d95f0e"],
        4: ["#ffffd4", "#fed98e", "#fe9929", "#cc4c02"],
        5: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
        6: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"],
        7: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
        8: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
        9: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]
    }, Purples: {
        3: ["#efedf5", "#bcbddc", "#756bb1"],
        4: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3"],
        5: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"],
        6: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
        7: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
        8: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
        9: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"]
    }, Blues: {
        3: ["#deebf7", "#9ecae1", "#3182bd"],
        4: ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"],
        5: ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
        6: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"],
        7: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
        8: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
        9: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]
    }, Greens: {
        3: ["#e5f5e0", "#a1d99b", "#31a354"],
        4: ["#edf8e9", "#bae4b3", "#74c476", "#238b45"],
        5: ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
        6: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
        7: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
        8: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
        9: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"]
    }, Oranges: {
        3: ["#fee6ce", "#fdae6b", "#e6550d"],
        4: ["#feedde", "#fdbe85", "#fd8d3c", "#d94701"],
        5: ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
        6: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603"],
        7: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
        8: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
        9: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"]
    }, Reds: {
        3: ["#fee0d2", "#fc9272", "#de2d26"],
        4: ["#fee5d9", "#fcae91", "#fb6a4a", "#cb181d"],
        5: ["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"],
        6: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"],
        7: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
        8: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
        9: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]
    }, Greys: {
        3: ["#f0f0f0", "#bdbdbd", "#636363"],
        4: ["#f7f7f7", "#cccccc", "#969696", "#525252"],
        5: ["#f7f7f7", "#cccccc", "#969696", "#636363", "#252525"],
        6: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#636363", "#252525"],
        7: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
        8: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
        9: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"]
    }, PuOr: {
        3: ["#f1a340", "#f7f7f7", "#998ec3"],
        4: ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"],
        5: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"],
        6: ["#b35806", "#f1a340", "#fee0b6", "#d8daeb", "#998ec3", "#542788"],
        7: ["#b35806", "#f1a340", "#fee0b6", "#f7f7f7", "#d8daeb", "#998ec3", "#542788"],
        8: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
        9: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
        10: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
        11: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"]
    }, BrBG: {
        3: ["#d8b365", "#f5f5f5", "#5ab4ac"],
        4: ["#a6611a", "#dfc27d", "#80cdc1", "#018571"],
        5: ["#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"],
        6: ["#8c510a", "#d8b365", "#f6e8c3", "#c7eae5", "#5ab4ac", "#01665e"],
        7: ["#8c510a", "#d8b365", "#f6e8c3", "#f5f5f5", "#c7eae5", "#5ab4ac", "#01665e"],
        8: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
        9: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
        10: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
        11: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"]
    }, PRGn: {
        3: ["#af8dc3", "#f7f7f7", "#7fbf7b"],
        4: ["#7b3294", "#c2a5cf", "#a6dba0", "#008837"],
        5: ["#7b3294", "#c2a5cf", "#f7f7f7", "#a6dba0", "#008837"],
        6: ["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"],
        7: ["#762a83", "#af8dc3", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#7fbf7b", "#1b7837"],
        8: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
        9: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
        10: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
        11: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"]
    }, PiYG: {
        3: ["#e9a3c9", "#f7f7f7", "#a1d76a"],
        4: ["#d01c8b", "#f1b6da", "#b8e186", "#4dac26"],
        5: ["#d01c8b", "#f1b6da", "#f7f7f7", "#b8e186", "#4dac26"],
        6: ["#c51b7d", "#e9a3c9", "#fde0ef", "#e6f5d0", "#a1d76a", "#4d9221"],
        7: ["#c51b7d", "#e9a3c9", "#fde0ef", "#f7f7f7", "#e6f5d0", "#a1d76a", "#4d9221"],
        8: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
        9: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
        10: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
        11: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"]
    }, RdBu: {
        3: ["#ef8a62", "#f7f7f7", "#67a9cf"],
        4: ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
        5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
        6: ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
        7: ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
        8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
        9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
        10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
        11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"]
    }, RdGy: {
        3: ["#ef8a62", "#ffffff", "#999999"],
        4: ["#ca0020", "#f4a582", "#bababa", "#404040"],
        5: ["#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040"],
        6: ["#b2182b", "#ef8a62", "#fddbc7", "#e0e0e0", "#999999", "#4d4d4d"],
        7: ["#b2182b", "#ef8a62", "#fddbc7", "#ffffff", "#e0e0e0", "#999999", "#4d4d4d"],
        8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
        9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
        10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
        11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"]
    }, RdYlBu: {
        3: ["#fc8d59", "#ffffbf", "#91bfdb"],
        4: ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
        5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
        6: ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
        7: ["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
        8: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
        9: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
        10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
        11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]
    }, Spectral: {
        3: ["#fc8d59", "#ffffbf", "#99d594"],
        4: ["#d7191c", "#fdae61", "#abdda4", "#2b83ba"],
        5: ["#d7191c", "#fdae61", "#ffffbf", "#abdda4", "#2b83ba"],
        6: ["#d53e4f", "#fc8d59", "#fee08b", "#e6f598", "#99d594", "#3288bd"],
        7: ["#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd"],
        8: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
        9: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
        10: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
        11: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"]
    }, RdYlGn: {
        3: ["#fc8d59", "#ffffbf", "#91cf60"],
        4: ["#d7191c", "#fdae61", "#a6d96a", "#1a9641"],
        5: ["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"],
        6: ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"],
        7: ["#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850"],
        8: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
        9: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
        10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
        11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]
    }, Accent: {
        3: ["#7fc97f", "#beaed4", "#fdc086"],
        4: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99"],
        5: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0"],
        6: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f"],
        7: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17"],
        8: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"]
    }, Dark2: {
        3: ["#1b9e77", "#d95f02", "#7570b3"],
        4: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a"],
        5: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e"],
        6: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"],
        7: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d"],
        8: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"]
    }, Paired: {
        3: ["#a6cee3", "#1f78b4", "#b2df8a"],
        4: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c"],
        5: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"],
        6: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"],
        7: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f"],
        8: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00"],
        9: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6"],
        10: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"],
        11: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99"],
        12: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]
    }, Pastel1: {
        3: ["#fbb4ae", "#b3cde3", "#ccebc5"],
        4: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4"],
        5: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"],
        6: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc"],
        7: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd"],
        8: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec"],
        9: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
    }, Pastel2: {
        3: ["#b3e2cd", "#fdcdac", "#cbd5e8"],
        4: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4"],
        5: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9"],
        6: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae"],
        7: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc"],
        8: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"]
    }, Set1: {
        3: ["#e41a1c", "#377eb8", "#4daf4a"],
        4: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"],
        5: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"],
        6: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33"],
        7: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628"],
        8: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf"],
        9: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"]
    }, Set2: {
        3: ["#66c2a5", "#fc8d62", "#8da0cb"],
        4: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"],
        5: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"],
        6: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f"],
        7: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"],
        8: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]
    }, Set3: {
        3: ["#8dd3c7", "#ffffb3", "#bebada"],
        4: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072"],
        5: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"],
        6: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462"],
        7: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69"],
        8: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"],
        9: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9"],
        10: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd"],
        11: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5"],
        12: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
    }};
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
    "small": ["5", "7", "9", "11", "13", "15", "17", "19"],
    /**
     * From 10px to 50px
     * @type Array
     */
    "medium": ["10", "15", "25", "30", "35", "40", "45", "50"],
    /**
     * From 10px to 80px
     * @type Array
     */
    "large": ["10", "20", "30", "40", "50", "60", "70", "80"]
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
    "small": 10,
    /**
     * The default font size
     * @type Number
     */
    "normal": 12,
    /**
     * A bigger font-size
     * @type Number
     */
    "medium": 14,
    /**
     * Large font-size
     * @type Number
     */
    "large": 18
};
/**
 * Object that defines the content, type and layout of a map
 * 
 * @class
 * @constructor
 * @property {String} [title=null] The title of the diagram
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
s4a.viz.DiagramData = function() {
var mDiagramData = {title: null,
        mapType: "choroplethMap",
        mapUnitType: null,
        mapUnitIDs: null,
        seriesLabels: null,
        seriesData: null,
        domains: null,
        colors: ["RdPu"],
        showLabels: false,
        showSeries: [0],
        mapWidth: "auto",
        mapHeight: "auto",
        fontSize: 12};
        return mDiagramData;
};
/* global s4a */

/**
 * Map visualization objects
 * @class
 * @namespace s4a.viz.map
 */
s4a.viz.map = {};

/**
 * The transparency to apply to statistical areas, bubbles and their respective
 * legends
 * @type {Number}
 */
s4a.viz.map.StatAreaAlpha = 0.75;

/**
 * Create a choropleth map layer for use in ol3
 * @param {s4a.viz.ViewCoordinator} mapData
 * @param {s4a.viz.DiagramData} mapConfig
 * @returns {ol.layer}
 */
s4a.viz.map.ChoroplethMapLayer = function (mapData, mapConfig) {
    console.log('Not implemented');
};

/**
 * Create a bubble map layer for use in ol3
 * @param {s4a.viz.ViewCoordinator} mapData
 * @param {s4a.viz.DiagramData} mapConfig
 * @returns {ol.layer}
 */
s4a.viz.map.BubbleMapLayer = function (mapData, mapConfig) {
    console.log('Not implemented');
};

/**
 * Draw a choropleth map inside the specified canvas
 * @param {Object} pDomNode
 * @param {Number} pWidth The width of the diagram
 * @param {Number} pHeight The height of the diagram
 * @param {s4a.viz.DiagramData} pDiagramData JSON
 * @returns {void}
 */
s4a.viz.map.getMap = function (pDomNode, pDiagramData) {

    // Determine default values for width/height if not present
    var pWidth = (pDiagramData.mapWidth === "auto") ? jQuery(pDomNode).width() : pDiagramData.mapWidth;
    var pHeight = (pDiagramData.mapHeight === "auto") ? jQuery(pDomNode).height() : pDiagramData.mapHeight;

    // Check if an existing canvas exists
    var mCanvas = jQuery(pDomNode + " canvas");
    if (mCanvas.length < 1) {
        mCanvas = jQuery("<canvas/>");
        jQuery(pDomNode).append(mCanvas);
    }
    // Need to handle the type of statistical unit here! Presently assumes everything is "kommune"
    var
            // Create HTML5 Canvas and return context
            mContext = mCanvas
            .prop("height", pHeight)
            .prop("width", pWidth)[0]
            .getContext("2d"),
            // Set the number of domains - default to jenks natural breaks
            mDomain = pDiagramData.domains.map(function (pValue) {
                return Number(pValue);
            }) || null,
            // Set a default color scale
            mColor = pDiagramData.colors !== null && (pDiagramData.colors.length >= 1) ? s4a.viz.color[pDiagramData.colors[0]][mDomain.length] :
            s4a.viz.color["Reds"][mDomain.length],
            // Set a default secondary color scale
            mColor2 = pDiagramData.colors !== null && (pDiagramData.colors.length >= 2) ? s4a.viz.color[pDiagramData.colors[1]][mDomain.length] :
            s4a.viz.color["Blues"][mDomain.length],
            // Set a default size range (for bubble diagrams etc)
            mSizes = s4a.viz.Sizes.medium,
            // Construct a color scale
            mColorScale = d3.scale.threshold()
            .domain(mDomain)
            .range(mColor),
            // Construct a secondary color scale
            mColorScale2 = d3.scale.threshold()
            .domain(mDomain)
            .range(mColor2),
            // Construct a size scale
            mSizeScale = mSizes !== null ? d3.scale.threshold()
            .domain(mDomain)
            .range(mSizes) : null,
            // Construct a data map object
            mDataMap = {},
            // Construct a data map object that maps to multiple values per id
            mDataMapMulti = {},
            // Initialize a series values object        
            mSeriesValues = [],
            // Construct a data map object for secondary data series
            mDataMap2 = {},
            // Initialize a series values object for secondary data  series
            mSeriesValues2 = [];

    for (var i = 0, j = pDiagramData.mapUnitIDs.length; i < j; i++) {

        mDataMapMulti[pDiagramData.mapUnitIDs[i]] = Number(pDiagramData.seriesData[i]);
        mDataMap[pDiagramData.mapUnitIDs[i]] = Number(pDiagramData.seriesData[i][pDiagramData.showSeries[0]]);
        mSeriesValues.push(Number(pDiagramData.seriesData[i][pDiagramData.showSeries[0]]));
    }

    if (pDiagramData.showSeries.length === 2) {
        for (i = 0, j = pDiagramData.mapUnitIDs.length; i < j; i++) {
            mDataMap2[pDiagramData.mapUnitIDs[i]] = Number(pDiagramData.seriesData[i][pDiagramData.showSeries[1]]);
            mSeriesValues2.push(Number(pDiagramData.seriesData[i][pDiagramData.showSeries[1]]));
        }
    }

    if (pDiagramData.title === null || pDiagramData.title === undefined || pDiagramData.title === '') {
        if (pDiagramData.showSeries.length > 1) {
            pDiagramData.title = pDiagramData.seriesLabels[pDiagramData.showSeries[0]] + " / " + pDiagramData.seriesLabels[pDiagramData.showSeries[2]];
        } else {
            pDiagramData.title = pDiagramData.seriesLabels[pDiagramData.showSeries[0]];
        }
    }

    // Load the data and basemap JSON files
    queue()
            .defer(d3.json, "./data/data-topojson.json")
            .defer(d3.json, "./data/sea.json")
            .await(function (pError, pStatAreas, pBaseMap) {

                var
                        //Create a d3.geo.projection object
                        mProjection = d3.geo.transverseMercator()
                        .scale(1)
                        .translate([0, 0]),
                        // Creat a d3.geo.path object
                        mPath = d3.geo.path()
                        .projection(mProjection),
                        // Read all topojson features into a GeoJson object
                        mStatGeometries = topojson.feature(pStatAreas, pStatAreas.objects.kommune)
                        .features.filter(function (d) {
                            return (pDiagramData.mapUnitIDs.indexOf(d.id.toString()) !== -1);
                        }),
                        // Get the complete bounds of all features and calculate scale and translation
                        //var mBounds = mPath.bounds(zoomArea),
                        mBounds = s4a.viz.map.util.getFeatureCollectionBounds(mPath, mStatGeometries),
                        // Calculate the scale factor
                        s = 0.95 / Math.max((mBounds[1][0] - mBounds[0][0]) / pWidth, (mBounds[1][1] - mBounds[0][1]) / pHeight),
                        // Calculate the translation offset from zero
                        t = [(pWidth - s * (mBounds[1][0] + mBounds[0][0])) / 2, (pHeight - s * (mBounds[1][1] + mBounds[0][1])) / 2];

                // Update projection
                mProjection
                        .scale(s)
                        .translate(t);

                // Clear the canvas and prepare for drawing 
                mContext.clearRect(0, 0, pWidth, pHeight);

                // Set white background color
                mContext.fillStyle = "#ffffff";
                mContext.fillRect(0, 0, pWidth, pHeight);

                // Draw basemap features I
                s4a.viz.map.shared._drawLand(mContext, mPath, pBaseMap);

                // Conditionally draw choropleth polygons
                if (pDiagramData.mapType === "choroplethMap" ||
                        pDiagramData.mapType === "bubbleChoroplethMap") {
                    s4a.viz.map.shared._drawPolygons(mStatGeometries, mDataMap, mColorScale, mPath, mContext);
                }

                // Draw basemap features II
                s4a.viz.map.shared._drawMunicipality(mContext, mPath, pStatAreas);
                s4a.viz.map.shared._drawCounty(mContext, mPath, pStatAreas);

                // Conditionally draw bubbles
                if (pDiagramData.mapType === "bubbleMap") {
                    s4a.viz.map.shared._drawBubbles(mStatGeometries, mDataMap, mSizeScale, mColorScale, mPath, mContext);
                }
                // Conditionally draw additional bubbles (series 2)
                else if (pDiagramData.mapType === "bubbleChoroplethMap") {
                    s4a.viz.map.shared._drawBubbles(mStatGeometries, mDataMap2, mSizeScale, mColorScale2, mPath, mContext);
                }
                // Conditionally draw pie charts
                else if (pDiagramData.mapType === "pieChartMap") {
                    s4a.viz.map.shared._drawPieCharts(mStatGeometries, mDataMapMulti, mColor, mPath, mContext);
                }

                // Draw labels
                s4a.viz.map.shared._drawLabels(mContext, mPath, mStatGeometries, (pDiagramData.fontSize - 2));

                // Draw legend  
                s4a.viz.map.shared._drawRectSymMapLegend(mContext, mColorScale, pDiagramData.title, Number(pDiagramData.fontSize));

                return mContext;
            });
};

/**
 * Namespace for map related utilities
 * @namespace
 */
s4a.viz.map.util = {};

/**
 * Return a unique URL to ensure that scripts/styles are reloaded every time
 * @param {String} pUrl An URL
 * @returns {String} URL with unique suffix
 */
s4a.viz.map.util.secureReload = function (pUrl) {
    var mConcatChar = pUrl.indexOf('?' !== -1) ? '?' : '&';
    return pUrl + mConcatChar + "rnd=" + (Math.random() * 100).toString();
};

/**
 * Returns the number of characters in the longest formatted number in an array of numbers
 * @param {number[]} numberArray An array of numbers to be measured
 * @returns {number} The number of characters in the longest number
 */
s4a.viz.map.util.getLengthOfLongest = function (numberArray) {
    var mLength = 0;
    if (numberArray !== null && numberArray.length > 1) {
        var tmpLength;
        for (var i = (numberArray.length - 1); i > 0; i--) {
            var mLabel = jQuery.number(numberArray[i - 1]) + " - " + jQuery.number(numberArray[i]);
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
 * @param {Array} pArray
 * @returns {String}
 */
s4a.viz.map.util.getLongestStringInArray = function (pArray) {
    var mArray = pArray.slice();
    return mArray.sort(function (a, b) {
        return b.toString().length - a.toString().length;
    })[0];
};

/**
 * Get the total product of the items in an array of numbers, i.e. passing the
 * array [1,3,4,5] to this function will return 1+3+4+5 = 13. Non-numeric values
 * will be ignored.
 * @param {Number} pDataArray An array of numbers
 * @returns {Number}
 */
s4a.viz.map.util.getTotal = function (pDataArray) {
    var pTotal = 0;
    for (var j = 0; j < pDataArray.length; j++) {
        pTotal += (typeof pDataArray[j] === 'number') ? pDataArray[j] : 0;
    }
    return pTotal;
};

/**
 * Method to transform json returned by xml2json to the correct format for the
 * diagram data object
 * @param {Object} pObject
 * @returns {AASDiag.DiagramData}
 */
s4a.viz.map.util.fixJsonData = function (pObject) {
    var mDiagramData = new s4a.viz.DiagramData();
    mDiagramData.title = pObject.title[0] || null;
    mDiagramData.mapType = pObject.type !== undefined ? pObject.type : mDiagramData.mapType;
    mDiagramData.mapUnitType = pObject.mapUnitType;
    mDiagramData.mapUnitIDs = pObject.categoryLabels.string;
    mDiagramData.seriesLabels = pObject.title.string;
    mDiagramData.seriesData = s4a.viz.map.util.fixSeriesJsonData(pObject.seriesData);
    mDiagramData.domains = pObject.intervals.float;
    mDiagramData.showLabels = pObject.showLabels || false;
    mDiagramData.showSeries = pObject.showSeries || [0];

    //Special handling of colors
    if (pObject.palette !== undefined) {
        mDiagramData.colors = pObject.palette !== undefined ? [pObject.palette] : mDiagramData.colors;
    } else {
        mDiagramData.colors = pObject.colors !== undefined ? [pObject.colors] : mDiagramData.colors;
    }

    return mDiagramData;
};

/**
 * Transform the series data object
 * @param {Object} pSeriesData
 * @returns {Array} Array of arrays containing series data
 */
s4a.viz.map.util.fixSeriesJsonData = function (pSeriesData) {
    var mSeriesData = [];
    for (var i = 0; i < pSeriesData.ArrayOfDecimal.length; i++) {
        mSeriesData.push(pSeriesData.ArrayOfDecimal[i].decimal);
    }
    return mSeriesData;
};
/**
 * Return the bounds of a feature collections
 * @param {Object} pPath A d3.js geo.path
 * @param {type} pFeatures An array of geojson features
 * @returns {Array} The combined bounds of the features [[xmin,ymin], [xmax,ymax]]
 */
s4a.viz.map.util.getFeatureCollectionBounds = function (pPath, pFeatures) {
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

s4a.viz.map.util.valuesToSlices = function (pSeries) {
    if (pSeries !== undefined && typeof pSeries === "object" && Array.isArray(pSeries) === true) {
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
/**
 * Define namespace utilities
 * @namespace
 * @type {Object}
 */
s4a.viz.map.shared = {};

/**
 * Draws the diagram title
 * @param {Object} pContext
 * @param {Number} pFontSize
 * @param {String} pTitle
 * @param {Number} pLeftMargin
 * @param {Number} pCurrentLinePosition
 * @returns {Number}
 */
s4a.viz.map.shared._drawDiagramTitle = function (pContext, pFontSize, pTitle, pLeftMargin, pCurrentLinePosition) {
    pContext.font = "bolder " + pFontSize + "px Arial";
    pContext.textAlign = "start"; // Right align the labels
    pContext.fillStyle = "#000000";
    pContext.fillText(pTitle, pLeftMargin, pCurrentLinePosition);
    return (pCurrentLinePosition += (pFontSize * 2));
};

/**
 * Draw map legend on canvas using a color scale
 * @param {Object} pContext A drawing context retrieved by calling
 * c.getContext("2d") on the HTML5 canvas element c
 * @param {Object} pColor A d3js threshold scale created by the funciton d3.scale.threshold()
 * @param {String} pTitle The title to print on top of the legend
 * @returns {void}
 */
s4a.viz.map.shared._drawRectSymMapLegend = function (pContext, pColor, pTitle, pFontSize) {

    pFontSize = pFontSize !== undefined ? pFontSize : s4a.viz.map.FontSizes.normal;

    var mLeftMargin = 10;
    var mTopMargin = 10;
    var mLineHeight = pFontSize * 1.8;
    var mKeyW = 20;
    var mKeyH = pFontSize + 4;

    var mYPos = mTopMargin + pFontSize;
    // Get the length of the longest legend label entry
    var mLongestLabel = s4a.viz.map.util.getLongestStringInArray(pColor.domain());
    pContext.font = pFontSize + "px Arial";
    var mRightAlignInset = pContext.measureText(mLongestLabel).width * 2;

    if (pTitle !== undefined && pTitle !== null && pTitle !== '') {
        mYPos = s4a.viz.map.shared._drawDiagramTitle(pContext, pFontSize, pTitle, mLeftMargin, mYPos);
    }

    pContext.font = pFontSize + "px Arial";
    pContext.textAlign = "end"; // Right align the labels

    // For each color in the scale
    for (var j = pColor.domain().length - 1; j > 0; j--) {
        var mLabel;
        if (j === pColor.domain().length - 1) {
            mLabel = "> " + jQuery.number(pColor.domain()[j - 1]);
        } else if (j === 1) {
            mLabel = "< " + jQuery.number(pColor.domain()[j]);
        } else {
            mLabel = jQuery.number(pColor.domain()[j - 1]) + " - " + jQuery.number(pColor.domain()[j]);
        }

        // Set legend symbol colors
        pContext.fillStyle = pColor.range()[j];
        pContext.strokeStyle = "#000000";
        pContext.lineWidth = 0.2;
        // Add legend symbol
        pContext.beginPath();
        pContext.rect(mLeftMargin, mYPos - pFontSize, mKeyW, mKeyH);
        pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
        pContext.fill();
        pContext.globalAlpha = 1.0;
        pContext.stroke();
        // Add legend label
        pContext.fillStyle = "#000000";
        pContext.fillText(mLabel, mLeftMargin + mKeyW + mLeftMargin + mRightAlignInset, mYPos);
        // Move to next line
        mYPos += mLineHeight;
    }
    return;
};

/**
 * Draw polygons from geometry collection
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {Object} pDataMap A JavaScript object with key/value pairs
 * @param {Object} pScale A d3.scale.threshold object
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pContext A Canvas 2d-context
 * @returns {void}
 */
s4a.viz.map.shared._drawPolygons = function (pGeoJson, pDataMap, pScale, pPath, pContext) {
    pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
    var mRange = pScale.domain();
    var mMax = Math.max.apply(null, mRange);
    var mMin = Math.min.apply(null, mRange);
    pGeoJson.forEach(function (pFeature) {
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
    return;
};

/**
 * Draw polygons from geometry collection
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {Object} pDataMapMulti A JavaScript object with key/value pairs
 * @param {Object} pScale A d3.scale.threshold object
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pContext A Canvas 2d-context
 * @returns {void}
 */
s4a.viz.map.shared._drawPieCharts = function (pGeoJson, pDataMapMulti, pColor, pPath, pContext) {
    pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
    pGeoJson.forEach(function (mFeature) {
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
 * @param {Object} pContext A drawing context retrieved by calling c.getContext("2d") on the HTML5 canvas element c
 * @param {Object} pColor A d3js threshold scale created by the funciton d3.scale.threshold()
 * @param {String} pTitle The title to print on top of the legend
 * @returns {void}
 */
s4a.viz.map.shared._drawCircleSymMapLegend = function (pContext, pColor, pTitle) {

    var mFontSize = 12;
    var mLeftMargin = 10;
    var mTopMargin = 10;
    var mLineHeight = mFontSize * 1.5;
    var mCurrentLinePosition = mTopMargin + mFontSize;
    // Get the length of the longest legend label entry
    var mRightAlignInset = s4a.viz.map.util.getLengthOfLongest(pColor.domain()) * (mFontSize / 1.5);
    // Insert logic for legend height here
    pContext.font = mFontSize + "px Arial Bold";
    pContext.textAlign = "start"; // Right align the labels
    pContext.fillStyle = "#000000";
    pContext.fillText("Teiknforklaring", mLeftMargin, mCurrentLinePosition);
    mCurrentLinePosition += mLineHeight;
    // Set font for legend items
    pContext.font = mFontSize + "px Arial";
    pContext.textAlign = "end"; // Right align the labels

    // For each color in the scale
    for (var j = pColor.domain().length - 1; j > 0; j--) {

        var mLabel = jQuery.number(pColor.domain()[j - 1]) + " - " + jQuery.number(pColor.domain()[j]);
        // Set legend symbol colors
        pContext.fillStyle = pColor.range()[j];
        pContext.strokeStyle = "#000000";
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
        pContext.fillStyle = "#000000";
        pContext.fillText(mLabel, mLeftMargin + mRightAlignInset, mCurrentLinePosition);
        // Move to next line
        mCurrentLinePosition += mLineHeight;
    }
    return;
};

/**
 * Draw polygons from geometry collection
 * @param {Object} pGeoJson An iterable collection of GeoJson features
 * @param {Object} pDataMap A JavaScript object with key/value pairs
 * @param {Object} pSizeScale A d3.scale.threshold object mapping to bubble sizes
 * @param {Object} pColorScale A d3.scale.threshold object mapping to bubble colors
 * @param {Object} pPath A d3.path.geo context
 * @param {Object} pContext A Canvas 2d-context
 * @returns {void}
 */
s4a.viz.map.shared._drawBubbles = function (pGeoJson, pDataMap, pSizeScale, pColorScale, pPath, pContext) {
    pContext.globalAlpha = s4a.viz.map.StatAreaAlpha;
    pGeoJson.forEach(function (pFeature) {
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
 * @param {Object} pGeoJson
 * @param {Object} pPath d3.geo.path object
 * @param {Object} pContext HTML5 2d-drawing context
 * @returns {void}
 */
s4a.viz.map.shared._drawLabels = function (pContext, pPath, pGeoJson, pFontSize) {

    pFontSize = pFontSize !== undefined ? pFontSize : s4a.viz.map.FontSizes.small;

    pGeoJson.forEach(function (pFeature) {
        var xy = pPath.centroid(pFeature);
        pContext.font = pFontSize + "px Arial";
        pContext.textAlign = "center"; // Right align the labels
        pContext.fillStyle = "#000000";
        pContext.fillText(pFeature.properties.name, xy[0], xy[1]);
    });
};


/**
 * Draw a geojson object on the canvas
 * @param {Object} pGeoJson
 * @param {String} pLineColor
 * @param {String} pFillColor
 * @param {Number} pLineWidth
 * @returns {void}
 */
s4a.viz.map.shared._drawGeoJson = function (pContext, pPath, pGeoJson, pLineColor, pFillColor, pLineWidth) {
    pContext.strokeStyle = pLineColor || "transparent";
    pContext.lineWidth = pLineWidth;
    pContext.fillStyle = pFillColor || "transparent";
    pContext.beginPath();
    pPath.context(pContext)(pGeoJson);
    if (pFillColor !== "transparent") {
        pContext.fill();
    }
    if (pLineColor !== "transparent") {
        pContext.stroke();
    }
    return;
};

/**
 * Draw municipality borders on the map
 * @param {Object} pStatUnitTopoJson
 * @returns {void}
 */
s4a.viz.map.shared._drawMunicipality = function (pContext, pPath, pStatUnitTopoJson) {
    var mKommune = topojson.mesh(pStatUnitTopoJson, pStatUnitTopoJson.objects.kommune, function (a, b) {
        return a.id !== b.id;
    });
    s4a.viz.map.shared._drawGeoJson(pContext, pPath, mKommune, "#000000", null, 0.5);
};

/**
 * Draw county borders on the map
 * @param {Object} pStatUnitTopoJson
 * @returns {void}
 */
s4a.viz.map.shared._drawCounty = function (pContext, pPath, pStatUnitTopoJson) {
    var mCounty = topojson.mesh(pStatUnitTopoJson, pStatUnitTopoJson.objects.fylke, function (a, b) {
        return a.id !== b.id;
    });
    s4a.viz.map.shared._drawGeoJson(pContext, pPath, mCounty, "#000000", null, 1);
};

/**
 * Draw land polygon on the map
 * @param {Object} pStatUnitTopoJson
 * @returns {void}
 */
s4a.viz.map.shared._drawLand = function (pContext, pPath, pLandTopoJson) {
    var mLand = topojson.feature(pLandTopoJson, pLandTopoJson.objects.sea);
    s4a.viz.map.shared._drawGeoJson(pContext, pPath, mLand, "#999999", "#eeeeee", 0.2);
};