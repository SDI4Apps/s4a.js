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
